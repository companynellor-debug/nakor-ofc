import { createFileRoute } from "@tanstack/react-router";

const FALLBACK = {
  nota: 7.5,
  mensagem_resultado:
    "Parece que os servidores estão focados em outra coisa. Mas você mandou bem!",
  mensagem_card: "Focado e offline 😎",
};

export const Route = createFileRoute("/api/evaluate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const {
            nome,
            duracao,
            duracao_real,
            saidas,
            subtarefas,
            texto_antes,
            texto_depois,
          } = (await request.json()) as Record<string, unknown>;

          const prompt = `Você é o sistema de avaliação do Nakor. Analise a sessão de foco e retorne APENAS um JSON válido sem markdown:
{"nota": 8.7, "mensagem_resultado": "mensagem motivacional curta com humor", "mensagem_card": "mensagem curta e engraçada para o card"}
A nota vai de 0 a 10 baseada em: tempo focado vs planejado, número de saídas (cada saída desconta 0.5), qualidade do relato no diário antes e depois. Mensagem varia se bateu a meta ou não — com humor leve.

Dados da sessão:
Nome da atividade: ${nome}
Duração planejada: ${duracao} minutos
Duração real: ${duracao_real} segundos
Saídas (distrações): ${saidas}
Subtarefas concluídas: ${subtarefas}
Diário antes: ${texto_antes || "Nenhum"}
Diário depois: ${texto_depois || "Nenhum"}`;

          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) throw new Error("LOVABLE_API_KEY não configurada");

          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [{ role: "user", content: prompt }],
              response_format: { type: "json_object" },
            }),
          });

          if (!res.ok) {
            const body = await res.text();
            console.error(`AI gateway failed [${res.status}]: ${body}`);
            throw new Error(`AI gateway failed [${res.status}]`);
          }

          const data = await res.json();
          const text = data?.choices?.[0]?.message?.content;
          if (!text) throw new Error("Empty response from AI");

          return Response.json(JSON.parse(text));
        } catch (error) {
          console.error("Evaluation error:", error);
          return Response.json(FALLBACK);
        }
      },
    },
  },
});
