// ==============================================================================
// PROTOCOLO DA CALISTENIA - BACKEND SUPABASE (EDGE FUNCTION)
// payment-webhook: Integração Segura de Checkout & Provisionamento VIP Automático
// Suporta: Hotmart, Stripe, Kiwify, Mercado Pago
// ==============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-token",
};

interface WebhookNormalizedPayload {
  platform: 'hotmart' | 'stripe' | 'kiwify' | 'mercadopago' | 'kashpay' | 'manual';
  eventId: string;
  eventType: 'PURCHASE_APPROVED' | 'SUBSCRIPTION_RENEWED' | 'REFUNDED' | 'CHARGEBACK' | 'SUBSCRIPTION_CANCELED';
  buyerEmail: string;
  buyerName: string;
  productId?: string;
  subscriptionId?: string;
  amountCents?: number;
  currency?: string;
  isBaseProduct: boolean; // Protocolo 21 Días Base ($9.90)
  isVipProduct: boolean;  // Assinatura VIP Recorrente ($4.90/mês)
  vipDurationDays?: number; // padrão 30 dias para assinatura mensal
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const webhookSecret = Deno.env.get("PAYMENT_WEBHOOK_SECRET"); // Token secreto configurado no checkout

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Configuração do servidor Supabase incompleta" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const rawBody = await req.json();

    // Validação de token de segurança da Hotmart (Hottok) ou genérico
    const expectedSecret = Deno.env.get("HOTMART_HOTTOK") || Deno.env.get("PAYMENT_WEBHOOK_SECRET");
    const providedSecret = rawBody.hottok || req.headers.get("x-hotmart-hottok") || req.headers.get("x-webhook-token") || new URL(req.url).searchParams.get("token");
    if (expectedSecret && providedSecret && providedSecret !== expectedSecret) {
      return new Response(
        JSON.stringify({ error: "Token de webhook não autorizado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalized = normalizeWebhookPayload(rawBody, req.headers);

    if (!normalized.buyerEmail) {
      return new Response(
        JSON.stringify({ error: "E-mail do comprador ausente no payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Cliente Supabase com permissões de administração (Service Role)
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    // 1. CHECAGEM DE IDEMPOTÊNCIA (Evita reprocessamento de webhooks duplicados)
    const { data: existingEvent } = await adminClient
      .from("payment_events")
      .select("id, processed_at")
      .eq("event_id", normalized.eventId)
      .maybeSingle();

    if (existingEvent) {
      console.log(`Evento ${normalized.eventId} já processado anteriormente. Retornando 200 OK.`);
      return new Response(
        JSON.stringify({ message: "Evento já processado", eventId: normalized.eventId }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. BUSCA OU CRIAÇÃO DO USUÁRIO NO SUPABASE AUTH
    let userId: string | null = null;
    const cleanEmail = normalized.buyerEmail.toLowerCase().trim();

    // Busca usuário existente pelo e-mail
    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const matchedUser = existingUsers?.users?.find(u => u.email?.toLowerCase() === cleanEmail);

    if (matchedUser) {
      userId = matchedUser.id;
    } else {
      // Cria novo usuário e envia e-mail de ativação/convite caso a compra seja aprovada
      if (normalized.eventType === 'PURCHASE_APPROVED' || normalized.eventType === 'SUBSCRIPTION_RENEWED') {
        const tempPassword = `Prot#${Math.random().toString(36).substring(2, 8).toUpperCase()}!21`;
        const { data: newUser, error: createErr } = await adminClient.auth.admin.createUser({
          email: cleanEmail,
          password: tempPassword,
          email_confirm: true,
          user_metadata: {
            full_name: normalized.buyerName || 'Soldado',
            registered_via: normalized.platform,
            initial_temp_pass: tempPassword
          }
        });

        if (createErr) {
          console.error("Erro ao criar usuário no Supabase Auth:", createErr);
        } else if (newUser?.user) {
          userId = newUser.user.id;
        }
      }
    }

    // 3. ATUALIZAÇÃO DO STATUS BASE E VIP NA TABELA PROFILES
    const isApproval = normalized.eventType === 'PURCHASE_APPROVED' || normalized.eventType === 'SUBSCRIPTION_RENEWED';
    const isRevocation = normalized.eventType === 'REFUNDED' || normalized.eventType === 'CHARGEBACK' || normalized.eventType === 'SUBSCRIPTION_CANCELED';

    if (userId) {
      if (isApproval) {
        const profileUpdate: any = {
          id: userId,
          full_name: normalized.buyerName || 'Soldado',
          has_base_access: true
        };

        if (normalized.isVipProduct) {
          const days = normalized.vipDurationDays || 30;
          const vipUntilDate = new Date();
          vipUntilDate.setDate(vipUntilDate.getDate() + days);
          profileUpdate.is_vip = true;
          profileUpdate.vip_until = vipUntilDate.toISOString();
          console.log(`VIP ativado com sucesso para o usuário ${userId} (${cleanEmail}) até ${vipUntilDate.toISOString()}`);
        }

        await adminClient.from("profiles").upsert(profileUpdate);
        console.log(`Acesso liberado com sucesso para o usuário ${userId} (${cleanEmail})`);
      } else if (isRevocation) {
        const profileUpdate: any = { id: userId };
        if (normalized.isVipProduct) {
          profileUpdate.is_vip = false;
          profileUpdate.vip_until = new Date().toISOString();
        }
        if (normalized.isBaseProduct && (normalized.eventType === 'REFUNDED' || normalized.eventType === 'CHARGEBACK')) {
          profileUpdate.has_base_access = false;
        }

        await adminClient.from("profiles").upsert(profileUpdate);
        console.log(`Acesso revogado/ajustado para o usuário ${userId} (${cleanEmail}) por motivo: ${normalized.eventType}`);
      }
    }

    // 4. REGISTRO NA TABELA DE AUDITORIA DE PAGAMENTOS
    await adminClient.from("payment_events").insert({
      event_id: normalized.eventId,
      platform: normalized.platform,
      event_type: normalized.eventType,
      buyer_email: cleanEmail,
      buyer_name: normalized.buyerName,
      product_id: normalized.productId || null,
      subscription_id: normalized.subscriptionId || null,
      amount_cents: normalized.amountCents || 0,
      currency: normalized.currency || 'USD',
      user_id: userId,
      payload: rawBody
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook processado com sucesso",
        userId,
        eventType: normalized.eventType,
        vipActive: isApproval
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    console.error("Erro interno no payment-webhook:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Erro interno no servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Normalizador agnóstico para Hotmart, Stripe, Kiwify e Mercado Pago
 */
function normalizeWebhookPayload(body: any, headers: Headers): WebhookNormalizedPayload {
  // 1. HOTMART (Versão 2.0.0 Oficial)
  if (body.event && body.data && (body.data.buyer || body.data.purchase)) {
    const rawEvent = String(body.event).toUpperCase();
    const isApproved = ['PURCHASE_APPROVED', 'SUBSCRIPTION_RENEWAL'].includes(rawEvent);
    const isRefund = ['PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK', 'PURCHASE_CANCELED'].includes(rawEvent);
    const isCancellation = ['SUBSCRIPTION_CANCELLATION'].includes(rawEvent);

    const buyer = body.data.buyer || {};
    const purchase = body.data.purchase || {};
    const product = body.data.product || {};
    const subscription = body.data.subscription || {};

    const priceVal = Number(purchase.price?.value || purchase.full_price?.value || 9.90);
    const isSub = Boolean(purchase.is_subscription || subscription.subscriber?.code || subscription.plan);
    const isOrderBump = Boolean(purchase.order_bump?.is_order_bump);
    const prodName = String(product.name || '').toLowerCase();

    // Distinção de Produto Base ($9.90) vs Assinatura VIP ($4.90) vs Order Bump
    const isVip = isSub || prodName.includes('vip') || priceVal <= 5.50;
    const isBase = !isSub || isOrderBump || prodName.includes('protocolo') || priceVal >= 8.00;

    let mappedEventType: WebhookNormalizedPayload['eventType'] = 'PURCHASE_APPROVED';
    if (rawEvent === 'SUBSCRIPTION_RENEWAL') mappedEventType = 'SUBSCRIPTION_RENEWED';
    else if (rawEvent === 'PURCHASE_CHARGEBACK') mappedEventType = 'CHARGEBACK';
    else if (rawEvent === 'SUBSCRIPTION_CANCELLATION') mappedEventType = 'SUBSCRIPTION_CANCELED';
    else if (isRefund) mappedEventType = 'REFUNDED';

    return {
      platform: 'hotmart',
      eventId: body.id || `hotmart_${purchase.transaction || Date.now()}`,
      eventType: mappedEventType,
      buyerEmail: buyer.email || '',
      buyerName: buyer.name || '',
      productId: String(product.id || ''),
      subscriptionId: subscription.subscriber?.code || undefined,
      amountCents: Math.round(priceVal * 100),
      currency: purchase.price?.currency_value || purchase.price?.currency_code_from_transaction || 'USD',
      isBaseProduct: isBase,
      isVipProduct: isVip,
      vipDurationDays: 30
    };
  }

  // 2. KIWIFY
  if (body.order_status && body.Customer) {
    const status = body.order_status.toLowerCase();
    const isApproved = status === 'paid' || status === 'approved';
    const isRefund = status === 'refunded' || status === 'chargedback';
    return {
      platform: 'kiwify',
      eventId: body.order_id || `kiwify_${Date.now()}`,
      eventType: isApproved ? 'PURCHASE_APPROVED' : isRefund ? 'REFUNDED' : 'PURCHASE_APPROVED',
      buyerEmail: body.Customer.email,
      buyerName: body.Customer.full_name || '',
      productId: body.Product?.product_id || '',
      subscriptionId: body.Subscription?.id || undefined,
      amountCents: body.order_amount ? Math.round(Number(body.order_amount) * 100) : 499,
      currency: 'BRL',
      isVipProduct: true,
      vipDurationDays: 30
    };
  }

  // 3. STRIPE
  if (body.type && body.data?.object) {
    const obj = body.data.object;
    const isApproved = body.type === 'checkout.session.completed' || body.type === 'invoice.payment_succeeded';
    const isRefund = body.type === 'charge.refunded' || body.type === 'customer.subscription.deleted';
    const email = obj.customer_details?.email || obj.customer_email || obj.billing_details?.email || '';
    return {
      platform: 'stripe',
      eventId: body.id || `stripe_${Date.now()}`,
      eventType: isApproved ? 'PURCHASE_APPROVED' : isRefund ? 'REFUNDED' : 'PURCHASE_APPROVED',
      buyerEmail: email,
      buyerName: obj.customer_details?.name || '',
      subscriptionId: obj.subscription || undefined,
      amountCents: obj.amount_total || obj.amount_paid || 499,
      currency: (obj.currency || 'usd').toUpperCase(),
      isVipProduct: true,
      vipDurationDays: 30
    };
  }

  // 4. KASHPAY (Checkout Popular para Tráfego Direto na América Latina)
  if (body.kashpay || body.payment_method || (body.customer && (body.status || body.event_type))) {
    const rawStatus = (body.status || body.event || body.event_type || '').toLowerCase();
    const isApproved = ['paid', 'approved', 'completed', 'success', 'purchase_approved'].includes(rawStatus);
    const isRefund = ['refunded', 'chargedback', 'canceled', 'chargeback'].includes(rawStatus);
    const email = body.customer?.email || body.buyer?.email || body.email || '';
    const name = body.customer?.name || body.customer?.full_name || body.buyer?.name || '';
    return {
      platform: 'kashpay' as any,
      eventId: body.transaction_id || body.order_id || body.id || `kashpay_${Date.now()}`,
      eventType: isApproved ? 'PURCHASE_APPROVED' : isRefund ? 'REFUNDED' : 'PURCHASE_APPROVED',
      buyerEmail: email,
      buyerName: name,
      productId: body.product_id || body.product?.id || undefined,
      amountCents: body.amount ? Math.round(Number(body.amount) * 100) : 499,
      currency: (body.currency || 'USD').toUpperCase(),
      isVipProduct: true,
      vipDurationDays: 30
    };
  }

  // 5. MERCADO PAGO OU PAYLOAD GENÉRICO / MANUAL
  return {
    platform: body.platform || 'manual',
    eventId: body.eventId || body.id || `manual_${Date.now()}`,
    eventType: body.eventType || (body.status === 'approved' ? 'PURCHASE_APPROVED' : 'PURCHASE_APPROVED'),
    buyerEmail: body.buyerEmail || body.email || body.payer?.email || '',
    buyerName: body.buyerName || body.name || body.payer?.first_name || '',
    productId: body.productId || undefined,
    subscriptionId: body.subscriptionId || undefined,
    amountCents: body.amountCents || 499,
    currency: body.currency || 'USD',
    isVipProduct: true,
    vipDurationDays: body.vipDurationDays || 30
  };
}

