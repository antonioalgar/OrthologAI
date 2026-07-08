import {
  Activity,
  BadgeEuro,
  BookOpen,
  Brain,
  Camera,
  ClipboardList,
  FileText,
  Hospital,
  Library,
  Microscope,
  PlayCircle,
  Plus,
  Scissors,
  Sparkles,
  TrendingUp
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Activity },
  { href: "/surgeries", label: "Registro", icon: ClipboardList },
  { href: "/surgeries/new", label: "Nueva cirugía", icon: Plus }
];

export const quickActions = [
  { label: "Nueva cirugía", icon: Scissors, tone: "bg-ink text-white" },
  { label: "Añadir aprendizaje", icon: Sparkles, tone: "bg-white text-ink" },
  { label: "Subir RX", icon: Camera, tone: "bg-white text-ink" },
  { label: "Preguntar IA", icon: Brain, tone: "bg-white text-ink" }
];

export const surgeries = [
  {
    id: "acl-revision-042",
    title: "Revisión LCA + plastia anterolateral",
    date: "24 Jun 2026",
    hospital: "Hospital Vithas Madrid",
    role: "Primer cirujano",
    procedure: "Revisión LCA",
    diagnosis: "Rotura iterativa LCA",
    region: "Rodilla",
    implant: "Tornillo BioComposite",
    tags: ["LCA", "Revisión", "Aloinjerto"],
    billed: true,
    paid: false,
    payment: 1250,
    complexity: "Alta"
  },
  {
    id: "triathlon-118",
    title: "Prótesis total de rodilla Triathlon",
    date: "19 Jun 2026",
    hospital: "Clínica Cemtro",
    role: "Ayudante",
    procedure: "PTR",
    diagnosis: "Gonartrosis tricompartimental",
    region: "Rodilla",
    implant: "Stryker Triathlon",
    tags: ["PTR", "Triathlon", "Artroplastia"],
    billed: true,
    paid: true,
    payment: 780,
    complexity: "Media"
  },
  {
    id: "mpfl-033",
    title: "Reconstrucción MPFL con autoinjerto",
    date: "12 Jun 2026",
    hospital: "Hospital Ruber",
    role: "Primer cirujano",
    procedure: "MPFL",
    diagnosis: "Inestabilidad rotuliana recidivante",
    region: "Rodilla",
    implant: "SwiveLock 4.75",
    tags: ["MPFL", "Rótula", "Autoinjerto"],
    billed: false,
    paid: false,
    payment: 950,
    complexity: "Media"
  },
  {
    id: "mat-medial-014",
    title: "Trasplante meniscal medial + osteotomía",
    date: "04 Jun 2026",
    hospital: "Hospital Vithas Madrid",
    role: "Ayudante",
    procedure: "MAT medial",
    diagnosis: "Síndrome postmeniscectomía",
    region: "Rodilla",
    implant: "Placa TomoFix",
    tags: ["MAT", "Osteotomía", "Menisco"],
    billed: true,
    paid: false,
    payment: 1100,
    complexity: "Alta"
  }
];

export const recentLearnings = [
  "En revisiones de LCA, preparar túnel femoral alternativo antes de retirar material evita perder orientación.",
  "En MPFL, comprobar tracking con flexión progresiva antes de fijar definitivamente.",
  "La osteotomía gana precisión si se marca la bisagra con radioscopia antes de iniciar corte."
];

export const libraryItems = [
  {
    title: "MPFL reconstruction: complications and pearls",
    type: "PDF",
    icon: FileText,
    meta: "Artículo · 2025 · 18 páginas",
    tags: ["MPFL", "Rótula"]
  },
  {
    title: "MAT medial: técnica paso a paso",
    type: "Vídeo",
    icon: PlayCircle,
    meta: "Curso · 42 min",
    tags: ["MAT", "Menisco"]
  },
  {
    title: "Notas personales sobre osteotomías",
    type: "Nota",
    icon: BookOpen,
    meta: "Actualizado hace 3 días",
    tags: ["Osteotomía", "Planificación"]
  },
  {
    title: "Triathlon sizing guide",
    type: "Documento",
    icon: Microscope,
    meta: "Implantes · Stryker",
    tags: ["PTR", "Triathlon"]
  }
];

export const statsCards = [
  { label: "Cirugías registradas", value: "248", delta: "+18 este mes", icon: Scissors },
  { label: "Facturado", value: "42.800 €", delta: "+12% trimestre", icon: BadgeEuro },
  { label: "Implantes Triathlon", value: "37", delta: "15% de PTR", icon: Hospital },
  { label: "Aprendizajes", value: "186", delta: "24 perlas", icon: Sparkles }
];

export const procedureData = [
  { name: "LCA", value: 54 },
  { name: "PTR", value: 37 },
  { name: "MPFL", value: 28 },
  { name: "MAT", value: 14 },
  { name: "Manguito", value: 31 }
];

export const monthlyData = [
  { month: "Ene", surgeries: 14, billing: 6200, learning: 9 },
  { month: "Feb", surgeries: 17, billing: 7600, learning: 14 },
  { month: "Mar", surgeries: 19, billing: 8200, learning: 15 },
  { month: "Abr", surgeries: 16, billing: 7100, learning: 13 },
  { month: "May", surgeries: 22, billing: 9800, learning: 19 },
  { month: "Jun", surgeries: 24, billing: 11300, learning: 21 }
];

export const similarCases = ["MPFL con túneles convergentes", "Revisión LCA con aloinjerto", "MAT medial + HTO"];
