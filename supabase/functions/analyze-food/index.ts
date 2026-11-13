// ==============================================================================
// SUPABASE EDGE FUNCTION: analyze-food
// Intermedia com segurança as requisições entre o PWA e o Google Gemini 2.0 Flash
// Mantém a chave GEMINI_API_KEY protegida nos secrets do Supabase
// ==============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  // 1. Responde a requisições CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY") ?? "";

    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY não configurada no Supabase Secrets." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Valida o cabeçalho de autenticação
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Cabeçalho de autorização ausente." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Token de usuário inválido ou expirado." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2.1 VERIFICAÇÃO DE ASSINATURA VIP (SEGURANÇA SERVER-SIDE OBRIGATÓRIA)
    // O Scanner Tático de Alimentos é exclusivo para assinantes VIP ativos.
    // Usuários sem VIP são rejeitados com 403 Forbidden ANTES de invocar o modelo de IA.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_vip, vip_until")
      .eq("id", user.id)
      .single();

    const isVipActive = Boolean(
      profile?.is_vip && (!profile?.vip_until || new Date(profile.vip_until) > new Date())
    );

    if (profileError || !isVipActive) {
      return new Response(
        JSON.stringify({
          error: "Acceso exclusivo para miembros VIP. Desbloquea el Scanner Táctico para analizar comidas por foto.",
          code: "VIP_REQUIRED",
          isVip: false
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Valida e consome a cota diária do usuário no PostgreSQL (máximo 10/dia para VIPs)
    const { data: quotaResult, error: quotaError } = await supabase.rpc(
      "check_and_increment_ai_quota",
      { target_user_id: user.id }
    );

    if (quotaError) {
      console.error("Erro ao validar cota:", quotaError);
      return new Response(
        JSON.stringify({ error: "Falha ao verificar cota de utilização." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!quotaResult?.allowed) {
      return new Response(
        JSON.stringify({
          error: quotaResult?.message || "Cota diária de análises de IA atingida.",
          limitReached: true,
          current: quotaResult?.current,
          limit: quotaResult?.limit
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Extrai a imagem em base64 da requisição
    const body = await req.json();
    const { imageBase64, mimeType = "image/jpeg" } = body;

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "Payload da imagem (base64) é obrigatório." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Remove eventual prefixo data:image/...;base64,
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    // 5. Prepara a chamada para a Gemini API com modelo ativo recomendado (gemini-2.5-flash / gemini-1.5-flash)
    const geminiModel = Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash";
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

    const systemInstruction = `
Eres la Inteligencia Nutricional Táctica del "Protocolo de Calistenia Militar".
Tu misión es analizar la fotografía de una comida enviada por un recluta o atleta y extraer con máxima honestidad y rigor analítico:
1. Todos los alimentos presentes en el plato (separando carbohidratos, proteínas magras, vegetales y grasas).
2. Estimar de forma realista la cantidad en gramos de cada porción basándote en la perspectiva visual del plato.
3. Calcular los macronutrientes (calorías, proteínas, carbohidratos, grasas) con base en tablas de referencia fidedignas (como TACO y USDA).
4. Indicar el nivel de confianza (0.0 a 1.0). Si un alimento no es 100% visible o está cubierto de salsa, debes señalar un grado de confianza menor y explicarlo.
5. Devolver estrictamente un objeto JSON conforme al esquema solicitado, sin texto markdown introductorio.
`;

    const requestPayload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: "Analiza nutricionalmente este plato de comida para un atleta de calistenia y devuelve los alimentos identificados, porciones en gramos y macronutrientes en formato JSON." },
            {
              inline_data: {
                mime_type: mimeType,
                data: cleanBase64
              }
            }
          ]
        }
      ],
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.2,
        response_mime_type: "application/json",
        response_schema: {
          type: "OBJECT",
          properties: {
            meal_name: { type: "STRING" },
            confidence_score: { type: "NUMBER" },
            tactical_feedback: { type: "STRING" },
            total_calories: { type: "INTEGER" },
            total_protein: { type: "NUMBER" },
            total_carbs: { type: "NUMBER" },
            total_fats: { type: "NUMBER" },
            items: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  grams: { type: "INTEGER" },
                  calories: { type: "INTEGER" },
                  protein: { type: "NUMBER" },
                  carbs: { type: "NUMBER" },
                  fats: { type: "NUMBER" },
                  confidence: { type: "NUMBER" },
                  category: { type: "STRING" }
                },
                required: ["name", "grams", "calories", "protein", "carbs", "fats"]
              }
            }
          },
          required: ["meal_name", "confidence_score", "total_calories", "total_protein", "total_carbs", "total_fats", "items"]
        }
      }
    };

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestPayload)
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error("Gemini API Error:", geminiResponse.status, errText);
      return new Response(
        JSON.stringify({ error: "Falha na comunicação com a API do Google Gemini.", details: errText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiJson = await geminiResponse.json();
    const candidateText = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return new Response(
        JSON.stringify({ error: "Resposta vazia retornada pelo modelo Gemini." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const parsedResult = JSON.parse(candidateText);

    return new Response(
      JSON.stringify({
        success: true,
        data: parsedResult,
        quota: {
          remaining: quotaResult.remaining,
          limit: quotaResult.limit
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Erro interno na Edge Function:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Erro interno do servidor." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

