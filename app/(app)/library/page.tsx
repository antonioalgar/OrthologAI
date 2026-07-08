import { ExternalLink, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { libraryItems } from "@/lib/mock-data";

export default function LibraryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Biblioteca"
        title="Artículos, vídeos y notas conectados con tus casos."
        description="Una biblioteca personal para guardar conocimiento externo y enlazarlo con experiencia quirúrgica real."
        action={<Button><Plus className="size-4" /> Nuevo recurso</Button>}
      />

      <Card className="mb-6">
        <div className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm text-graphite">
          <Search className="size-4" />
          Buscar MPFL, MAT, Triathlon, osteotomía...
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {libraryItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="group flex min-h-64 flex-col justify-between">
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div className="grid size-11 place-items-center rounded-lg bg-mist text-ink">
                    <Icon className="size-5" />
                  </div>
                  <Badge tone="blue">{item.type}</Badge>
                </div>
                <h2 className="text-lg font-semibold leading-7">{item.title}</h2>
                <p className="mt-3 text-sm text-graphite">{item.meta}</p>
              </div>
              <div>
                <div className="mb-4 mt-6 flex flex-wrap gap-2">
                  {item.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                </div>
                <button className="flex items-center gap-2 text-sm font-semibold text-cobalt">
                  Abrir recurso
                  <ExternalLink className="size-4 transition group-hover:translate-x-0.5" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
