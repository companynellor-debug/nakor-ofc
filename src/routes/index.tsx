import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { LanguageProvider } from "../nakor/lib/i18n";

const NakorApp = lazy(() => import("../nakor/App"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nakor — Foco, disciplina e resultados" },
      {
        name: "description",
        content:
          "Nakor é o app de foco que transforma suas sessões de estudo e trabalho em progresso real, com diário, conquistas e avaliação inteligente.",
      },
      { property: "og:title", content: "Nakor — Foco, disciplina e resultados" },
      {
        property: "og:description",
        content:
          "Sessões de foco com diário, conquistas e avaliação inteligente para você manter a constância.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="min-h-screen bg-brand-bg" />;
  }

  return (
    <LanguageProvider>
      <Suspense fallback={<div className="min-h-screen bg-brand-bg" />}>
        <NakorApp />
      </Suspense>
    </LanguageProvider>
  );
}
