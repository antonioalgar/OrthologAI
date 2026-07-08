import { Brain, Search, Send, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const questions = [
  "Muéstrame todas las revisiones de LCA",
  "Cuántas prótesis Triathlon he implantado",
  "Qué aprendí sobre osteotomías",
  "Haz un resumen de mi experiencia con MPFL"
];

export default function AskPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ask OrthoLog"
        title="Pregunta a tu memoria quirúrgica."
        description="Interfaz simulada de IA. Más adelante responderá usando cirugías, biblioteca, implantes, aprendizajes y facturación."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <section className="paper-panel flex min-h-[640px] flex-col rounded-lg">
          <div className="border-b border-line p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-lg bg-ink text-white">
                <Brain className="size-5" />
              </div>
              <div>
                <h2 className="font-semibold">Conversación simulada</h2>
                <p className="text-sm text-graphite">Respuestas con citas internas ficticias</p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5 p-5">
            <div className="max-w-[82%] rounded-lg bg-mist p-4 text-sm leading-7">
              Haz un resumen de mi experiencia con MPFL.
            </div>
            <div className="ml-auto max-w-[90%] rounded-lg bg-ink p-5 text-white">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4" />
                OrthoLog AI
              </div>
              <p className="text-sm leading-7 text-white/86">
                Has registrado 28 casos relacionados con MPFL. Tus aprendizajes se repiten en tres temas: control del tracking antes de la fijación, posición femoral y tensión del injerto en flexión. En los últimos casos aparece una preferencia por autoinjerto y fijación ajustable.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone="dark">MPFL 033</Badge>
                <Badge tone="dark">Rótula</Badge>
                <Badge tone="dark">Perlas del adjunto</Badge>
              </div>
            </div>
          </div>

          <div className="border-t border-line p-4">
            <div className="flex gap-2 rounded-lg border border-line bg-white p-2">
              <div className="flex flex-1 items-center gap-2 px-2 text-sm text-graphite">
                <Search className="size-4" />
                Pregunta sobre casos, implantes, aprendizajes...
              </div>
              <Button><Send className="size-4" /> Enviar</Button>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="paper-panel rounded-lg p-5">
            <h2 className="font-semibold">Preguntas sugeridas</h2>
            <div className="mt-4 grid gap-2">
              {questions.map((question) => (
                <button key={question} className="rounded-md border border-line bg-white px-3 py-2 text-left text-sm text-graphite transition hover:text-ink">
                  {question}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-cobalt p-5 text-white shadow-soft">
            <p className="text-sm font-semibold">Modo futuro</p>
            <p className="mt-2 text-sm leading-6 text-white/78">
              La IA usará búsqueda semántica y citas internas, sin inventar datos que no estén registrados.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
