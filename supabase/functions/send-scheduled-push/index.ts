import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
    const vapidSubject = Deno.env.get("VAPID_SUBJECT") ?? "mailto:soporte@protocolocalistenia.com";

    if (!vapidPublicKey || !vapidPrivateKey) {
      return new Response(
        JSON.stringify({ error: "Chaves VAPID não configuradas nos Secrets do Supabase." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Carrega todas as assinaturas ativas com o perfil do usuário associado
    const { data: subs, error: subsErr } = await supabase
      .from("push_subscriptions")
      .select("*, profiles:user_id(current_day, completed_days, name)")
      .eq("is_active", true);

    if (subsErr) throw subsErr;

    const nowUtc = new Date();
    let sentCount = 0;
    let skippedCount = 0;
    const errors: any[] = [];

    for (const sub of subs || []) {
      // 2. Calcula a hora atual no fuso horário do usuário
      let userHourStr = "18:30";
      try {
        const dtf = new Intl.DateTimeFormat("en-GB", {
          timeZone: sub.timezone || "America/Sao_Paulo",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
        userHourStr = dtf.format(nowUtc); // Ex: "18:32"
      } catch (e) {
        userHourStr = "18:30";
      }

      // Janela de correspondência (compara hora exata configurada, ex: "18:30")
      const [uH, uM] = userHourStr.split(":").map(Number);
      const [pH, pM] = (sub.preferred_hour || "18:30").split(":").map(Number);

      const diffMinutes = Math.abs((uH * 60 + uM) - (pH * 60 + pM));
      
      // Se não estiver dentro da janela de 15 minutos do cron, pula
      if (diffMinutes > 15 && diffMinutes < 1425) {
        continue;
      }

      // Evita disparos duplicados no mesmo dia
      if (sub.last_notified_at) {
        const lastDate = new Date(sub.last_notified_at).toISOString().split("T")[0];
        const todayDate = nowUtc.toISOString().split("T")[0];
        if (lastDate === todayDate) {
          skippedCount++;
          continue;
        }
      }

      // 3. Pula usuário se ele já completou o treino de hoje
      const profile = sub.profiles;
      const currentDay = profile?.current_day || 1;
      const completedDays: number[] = profile?.completed_days || [];
      if (completedDays.includes(currentDay)) {
        skippedCount++;
        continue;
      }

      // 4. Variação tática militar da mensagem
      const userName = profile?.name ? profile.name.split(" ")[0] : "Recluta";
      const messages = [
        `⚔️ ${userName}, tu misión del Día ${currentDay} está lista en el Centro de Comando. ¡Mantén tu racha!`,
        `🔥 ¡La disciplina no se negocia! Completa tus 15 minutos de calistenia del Día ${currentDay}.`,
        `🎯 Día ${currentDay} desbloqueado. Tu transformación física se construye hoy. ¡Cero excusas!`,
        `🛡️ Centro de Mando: Sesión del Día ${currentDay} programada para tu perfil. ¡A entrenar!`
      ];
      const selectedBody = messages[currentDay % messages.length];

      const payload = JSON.stringify({
        title: "PROTOCOLO DE LA CALISTENIA",
        body: selectedBody,
        icon: "./assets/favicon.svg",
        badge: "./assets/favicon.svg",
        data: {
          url: "./app/index.html",
          day: currentDay
        }
      });

      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };

      try {
        await webpush.sendNotification(pushSubscription, payload);
        sentCount++;

        // Atualiza carimbo de notificação
        await supabase
          .from("push_subscriptions")
          .update({ last_notified_at: nowUtc.toISOString() })
          .eq("id", sub.id);
      } catch (pushErr: any) {
        // Se o endpoint expirou (código 410 Gone ou 404), desativa a assinatura
        if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
          await supabase
            .from("push_subscriptions")
            .update({ is_active: false })
            .eq("id", sub.id);
        }
        errors.push({ id: sub.id, error: pushErr.message });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        enviados: sentCount,
        ignorados_ja_treinaram: skippedCount,
        erros: errors.length,
        detalhes_erros: errors
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

