# OrthoLog AI - Project Plan

## 1. Vision del producto

OrthoLog AI es una aplicacion profesional para un traumatologo individual.

Su filosofia central es:

> El segundo cerebro del cirujano.

No es un gestor hospitalario, no es un HIS, no es un CRM medico y no tiene como objetivo principal administrar pacientes. Su objetivo principal es registrar, organizar, analizar y transformar la experiencia quirurgica acumulada durante toda una carrera profesional.

Cada cirugia debe convertirse en una pagina viva, parecida a Notion: flexible, rica en contenido, facil de completar, conectada con archivos y profundamente buscable mediante IA.

La promesa del producto:

- recordar cada caso quirurgico importante
- encontrar patrones en la propia experiencia
- aprender de lo que se hizo, se vio y se penso
- medir actividad, facturacion y evolucion profesional
- convertir cientos o miles de cirugias en conocimiento consultable

## 2. Principio fundamental

OrthoLog AI no empieza por el paciente. Empieza por la experiencia quirurgica.

El paciente existe como contexto anonimizado o semianonimizado del caso, pero la unidad principal de la aplicacion es la cirugia.

La pregunta de producto no es:

> Que paciente tengo que gestionar?

Sino:

> Que he operado, que aprendi y como puedo recuperar ese conocimiento cuando lo necesite?

## 3. Stack tecnico

- Framework: Next.js 15 con App Router.
- Lenguaje: TypeScript.
- UI: React y Tailwind CSS.
- Base de datos: Supabase Postgres.
- Autenticacion: Supabase Auth.
- Storage: Supabase Storage para fotografias, radiografias, videos, PDFs y documentos.
- IA: capa propia de servicios para embeddings, busqueda semantica, resumen y preguntas sobre la experiencia quirurgica.
- Validacion: Zod.
- Formularios: React Hook Form.
- Componentes UI: sistema propio inspirado en Notion, Linear y Apple, apoyado en Radix UI o shadcn/ui si conviene.
- Iconos: lucide-react.
- Editor: editor por bloques o markdown enriquecido para notas quirurgicas, biblioteca y aprendizajes.
- Busqueda semantica: embeddings almacenados en Supabase con pgvector.
- Deployment: Vercel + Supabase Cloud.

## 4. Experiencia de usuario

La aplicacion debe sentirse como un cuaderno quirurgico premium.

Referencias de experiencia:

- Notion: paginas flexibles, bloques, contenido mixto y biblioteca personal.
- Linear: rapidez, teclado, busqueda, filtros, listas limpias.
- Apple: claridad visual, espaciado, transiciones sutiles y sensacion de producto pulido.

La pantalla principal no debe parecer un panel administrativo hospitalario. Debe parecer un espacio de trabajo personal para pensar, registrar y revisar carrera quirurgica.

Principios:

- captura rapida despues de operar
- edicion progresiva, no formularios interminables
- cada cirugia como pagina
- archivos visuales siempre cerca del relato quirurgico
- IA visible, accesible y central
- estadisticas utiles, no decorativas
- privacidad y control individual

## 5. Usuario objetivo

Usuario principal:

- traumatologo individual
- residente avanzado, fellow, adjunto joven o cirujano consolidado
- trabaja en uno o varios hospitales
- quiere registrar su actividad quirurgica y su aprendizaje
- necesita consultar experiencia acumulada por procedimiento, implante, diagnostico, tecnica o aprendizaje

Casos de uso reales:

- "Cuantas protesis Triathlon he implantado?"
- "Muestrame todas mis revisiones de LCA."
- "Que aprendi sobre osteotomias?"
- "Busca todos los casos con MAT medial."
- "Haz un resumen de mi experiencia con MPFL."
- "En que hospitales he hecho mas artroscopias de hombro?"
- "Que casos facture y aun no he cobrado?"
- "Que perlas me dieron sobre plastia anterolateral?"

## 6. Arquitectura conceptual

La aplicacion tendra cinco grandes modulos:

1. Registro quirurgico
2. Inteligencia artificial
3. Biblioteca
4. Dashboard
5. Ajustes y privacidad

El Registro quirurgico es la base de datos vital del cirujano.

La IA es el eje transversal: indexa, resume, encuentra, relaciona y responde.

La Biblioteca almacena conocimiento externo y personal: articulos, PDFs, videos, notas, protocolos, tecnicas y referencias conectadas con casos reales.

El Dashboard convierte la actividad quirurgica en estadisticas, evolucion profesional y control economico.

## 7. Unidad principal: la pagina de cirugia

Cada cirugia debe funcionar como una pagina estilo Notion.

Debe combinar:

- campos estructurados
- bloques de texto libre
- archivos multimedia
- etiquetas
- enlaces a biblioteca
- resumen IA
- busqueda semantica

La pagina debe permitir escritura rapida, pero tambien analisis posterior.

### Campos principales

#### Informacion basica

- Fecha
- Hospital
- Cirujano principal
- Mi rol
- Pago
- Facturado
- Cobrado

#### Paciente

El paciente se registra solo como contexto del caso. La V1 debe favorecer identificadores anonimizados o seudonimos.

- Identificador
- Edad
- Sexo
- IMC
- Profesion
- Deporte

#### Diagnostico

- diagnostico principal
- diagnosticos secundarios
- lateralidad
- region anatomica
- clasificaciones si aplica
- etiquetas clinicas

#### Procedimiento

- procedimiento principal
- procedimientos asociados
- tecnica usada
- abordaje
- tiempo quirurgico si se desea
- complicaciones intraoperatorias si existieron

#### Implantes

- marca
- modelo
- tipo
- talla/medida
- cantidad
- lote si el usuario desea registrarlo
- notas asociadas

#### Fotografias

- fotografias intraoperatorias
- fotografias clinicas anonimizadas
- fotografias de planificacion o seguimiento

#### Radiografias

- preoperatorias
- intraoperatorias
- postoperatorias
- controles evolutivos

#### Videos

- videos artroscopicos
- clips quirurgicos
- explicaciones tecnicas
- videos docentes vinculados al caso

#### Documentos

- informes
- consentimientos anonimizados si procede
- planificaciones
- PDFs relacionados
- documentos de facturacion

#### Observaciones quirurgicas

Campo narrativo objetivo.

Debe responder:

- que ocurrio durante la cirugia
- que hallazgos hubo
- que decisiones se tomaron
- que dificultades aparecieron
- que cambios se hicieron respecto al plan

Este campo no es reflexivo. Es el registro tecnico del caso.

#### Que he aprendido hoy

Campo personal y longitudinal.

Debe capturar:

- aprendizajes tecnicos
- errores evitables
- decisiones que funcionaron
- dudas para revisar
- cambios que aplicaria en el futuro

Este campo es uno de los activos mas importantes de OrthoLog AI.

#### Perlas del adjunto

Campo dedicado a consejos, frases, criterios o trucos recibidos de otros cirujanos.

Debe poder buscarse despues por tecnica, procedimiento, adjunto, region anatomica o palabra clave.

#### Resumen IA

Resumen generado automaticamente por IA a partir del contenido de la pagina.

Debe incluir:

- resumen tecnico
- puntos clave
- implantes usados
- aprendizajes personales
- posibles etiquetas
- temas relacionados en la biblioteca
- casos similares

El usuario debe poder editar, regenerar, aceptar o descartar el resumen.

## 8. IA como eje de la aplicacion

La IA no debe ser una funcion secundaria. Debe ser la interfaz principal para recuperar conocimiento.

Objetivos de IA:

- responder preguntas sobre toda la experiencia quirurgica
- encontrar casos por significado, no solo por texto exacto
- resumir experiencia acumulada por tecnica, diagnostico o implante
- detectar patrones de actividad y aprendizaje
- relacionar cirugias con articulos, videos y notas de biblioteca
- generar etiquetas sugeridas
- ayudar a completar una pagina quirurgica

### Preguntas que debe responder

- Muestrame todas las revisiones de LCA.
- Cuantas protesis Triathlon he implantado?
- Que aprendi sobre osteotomias?
- Busca todos los casos con MAT medial.
- Haz un resumen de mi experiencia con MPFL.
- Que complicaciones he registrado en artroplastias?
- Que perlas tengo sobre manguito rotador?
- En que casos use aloinjerto?
- Que cirugias hice como primer cirujano este ano?
- Cuales son mis procedimientos mas frecuentes?

### Capacidades IA V1

- chat sobre mis cirugias
- busqueda semantica global
- resumen automatico de cada cirugia
- extraccion de etiquetas desde texto libre
- deteccion de implantes mencionados
- agrupacion de casos similares
- resumen por tema o procedimiento
- sugerencias de enlaces a biblioteca

### Arquitectura IA

Componentes:

- generacion de embeddings para cirugias, notas y biblioteca
- tabla de chunks semanticos
- busqueda vectorial con pgvector
- retrieval augmented generation para responder preguntas
- prompts especializados para traumatologia
- citas internas hacia casos y documentos usados como fuente

La IA debe responder con referencias internas:

- caso quirurgico
- fecha
- procedimiento
- fragmento relevante
- documento o nota relacionada

La IA no debe inventar datos no registrados. Cuando no encuentre informacion suficiente, debe decirlo claramente.

## 9. Biblioteca

La Biblioteca es el segundo gran pilar de OrthoLog AI.

Debe permitir guardar y conectar conocimiento externo y personal.

Tipos de contenido:

- articulos cientificos
- PDFs
- videos
- enlaces web
- notas personales
- protocolos
- tecnicas quirurgicas
- plantillas
- perlas generales
- resummenes de cursos o congresos

Cada elemento de biblioteca puede tener:

- titulo
- tipo
- autores/fuente
- ano
- URL
- archivo adjunto
- etiquetas
- region anatomica
- procedimiento relacionado
- notas personales
- resumen IA
- casos enlazados

Relaciones clave:

- una cirugia puede enlazar varios recursos de biblioteca
- un articulo puede enlazar varios casos reales
- una nota tecnica puede aparecer como referencia sugerida en casos similares
- la IA puede usar biblioteca y cirugias para responder preguntas

Ejemplos:

- un PDF sobre MPFL enlazado con todos los casos de MPFL
- un video de tecnica MAT medial conectado con casos donde se hizo MAT
- una nota personal sobre osteotomias conectada con aprendizajes de varios casos

## 10. Dashboard

El Dashboard debe mostrar la evolucion quirurgica y profesional del traumatologo.

No debe ser un panel hospitalario. Debe ser un tablero personal de carrera.

Secciones V1:

### Actividad quirurgica

- numero total de cirugias
- cirugias por mes/ano
- cirugias por hospital
- cirugias por rol
- cirugias por region anatomica
- cirugias por procedimiento

### Experiencia tecnica

- procedimientos mas frecuentes
- implantes mas usados
- evolucion de tecnicas a lo largo del tiempo
- casos por lateralidad
- numero de revisiones vs primarias
- casos complejos marcados por el usuario

### Aprendizaje

- aprendizajes registrados por mes
- temas mas repetidos en "Que he aprendido hoy"
- perlas por adjunto o tema
- casos destacados para revisar
- notas de biblioteca mas enlazadas

### Facturacion

- total pendiente de facturar
- total facturado
- total cobrado
- pagos por hospital
- pagos por periodo
- cirugias sin informacion economica completa

### Accesos rapidos

- nueva cirugia
- nueva nota de biblioteca
- preguntar a la IA
- revisar casos recientes
- casos pendientes de resumen IA

## 11. Pantallas V1

### Auth

- Login
- Registro
- Recuperacion de contrasena

### Onboarding

- nombre del cirujano
- especialidad o subespecialidades
- hospitales habituales
- roles habituales
- preferencias de privacidad
- importacion inicial opcional en fases futuras

### Home / Dashboard

Vista inicial con:

- actividad reciente
- estadisticas clave
- cirugias recientes
- aprendizajes recientes
- estado de facturacion
- entrada directa al chat IA

### Registro quirurgico

Vista principal de todas las cirugias.

Debe incluir:

- tabla/lista premium
- filtros por fecha, hospital, rol, procedimiento, diagnostico, implante, region anatomica y estado de cobro
- busqueda textual
- busqueda semantica
- vistas guardadas
- opcion de nueva cirugia

### Pagina de cirugia

Pantalla central del producto.

Debe tener:

- titulo editable
- metadata superior
- bloques estructurados
- editor tipo Notion
- galerias de fotos, RX y videos
- documentos
- implantes
- observaciones quirurgicas
- aprendizajes
- perlas
- resumen IA
- casos similares
- biblioteca relacionada

En desktop:

- columna principal para el contenido
- panel lateral con metadata, etiquetas, facturacion e IA

En iPad:

- contenido principal con panel lateral colapsable

En iPhone:

- secciones apiladas
- acciones principales fijas
- subida rapida de foto/video/documento

### IA / Ask OrthoLog

Interfaz conversacional global.

Debe permitir preguntar sobre:

- cirugias
- aprendizajes
- implantes
- biblioteca
- facturacion
- evolucion de actividad

Debe devolver:

- respuesta sintetica
- casos fuente
- documentos fuente
- filtros aplicados
- acciones sugeridas

### Biblioteca

Vista de recursos guardados.

Debe incluir:

- listado por tipo
- filtros por region, procedimiento, etiqueta y fuente
- subida de PDF
- guardado de enlaces
- notas personales
- resumen IA
- casos vinculados

### Estadisticas

Puede ser parte del Dashboard o una pantalla dedicada.

Debe permitir profundizar en:

- actividad quirurgica
- tecnicas
- implantes
- hospitales
- roles
- facturacion
- aprendizaje

### Ajustes

- perfil
- hospitales
- cirujanos/adjuntos frecuentes
- catalogo de implantes
- etiquetas
- privacidad
- exportacion de datos
- configuracion IA

## 12. Modelo de datos V1

La base de datos debe estar pensada para una cuenta individual, pero sin bloquear una futura evolucion hacia equipos o colaboracion.

### `profiles`

- `id`
- `full_name`
- `email`
- `specialty`
- `subspecialties`
- `avatar_url`
- `created_at`
- `updated_at`

### `surgeries`

- `id`
- `user_id`
- `title`
- `surgery_date`
- `hospital_id`
- `lead_surgeon`
- `my_role`
- `payment_amount`
- `is_invoiced`
- `is_paid`
- `patient_identifier`
- `patient_age`
- `patient_sex`
- `patient_bmi`
- `patient_profession`
- `patient_sport`
- `diagnosis`
- `procedure`
- `anatomical_region`
- `laterality`
- `surgical_observations`
- `lessons_learned`
- `senior_surgeon_pearls`
- `ai_summary`
- `is_favorite`
- `complexity`
- `created_at`
- `updated_at`

### `hospitals`

- `id`
- `user_id`
- `name`
- `city`
- `notes`
- `created_at`

### `implants`

- `id`
- `user_id`
- `name`
- `brand`
- `model`
- `type`
- `notes`
- `created_at`

### `surgery_implants`

- `id`
- `surgery_id`
- `implant_id`
- `quantity`
- `size`
- `lot`
- `notes`
- `created_at`

### `surgery_media`

- `id`
- `user_id`
- `surgery_id`
- `type`
- `bucket`
- `path`
- `file_name`
- `mime_type`
- `file_size`
- `caption`
- `created_at`

Tipos de media:

- photo
- xray
- video
- document

### `library_items`

- `id`
- `user_id`
- `title`
- `type`
- `source`
- `authors`
- `year`
- `url`
- `bucket`
- `path`
- `notes`
- `ai_summary`
- `created_at`
- `updated_at`

Tipos:

- article
- pdf
- video
- note
- protocol
- link
- course

### `surgery_library_links`

- `id`
- `surgery_id`
- `library_item_id`
- `relationship`
- `created_at`

### `tags`

- `id`
- `user_id`
- `name`
- `type`
- `created_at`

### `surgery_tags`

- `id`
- `surgery_id`
- `tag_id`

### `library_tags`

- `id`
- `library_item_id`
- `tag_id`

### `semantic_chunks`

- `id`
- `user_id`
- `source_type`
- `source_id`
- `chunk_type`
- `content`
- `embedding`
- `metadata`
- `created_at`
- `updated_at`

Fuentes:

- surgery
- surgery_observations
- lessons_learned
- senior_surgeon_pearls
- ai_summary
- library_item
- library_note

### `ai_conversations`

- `id`
- `user_id`
- `title`
- `created_at`
- `updated_at`

### `ai_messages`

- `id`
- `conversation_id`
- `role`
- `content`
- `citations`
- `created_at`

## 13. Seguridad y privacidad

La aplicacion trabajara con informacion clinica sensible o potencialmente sensible. La V1 debe asumir privacidad estricta aunque el producto sea individual.

Principios:

- autenticacion obligatoria
- RLS en todas las tablas
- cada registro pertenece a `user_id`
- ningun usuario puede leer datos de otro
- storage separado por usuario
- URLs firmadas para archivos privados
- evitar datos identificativos directos del paciente
- favorecer identificadores anonimizados
- permitir exportar y borrar datos

Politicas:

- solo el propietario puede leer/escribir sus cirugias
- solo el propietario puede leer/escribir su biblioteca
- solo el propietario puede acceder a archivos
- los embeddings tambien deben estar protegidos por `user_id`

IA y privacidad:

- informar claramente que texto se envia a IA
- permitir excluir campos sensibles de la indexacion
- preparar opcion futura de anonimizar antes de enviar
- no registrar prompts con datos innecesarios
- no exponer datos clinicos en logs

## 14. Estructura de carpetas propuesta

```txt
ortholog-ai/
  app/
    (auth)/
      login/
        page.tsx
      register/
        page.tsx
      reset-password/
        page.tsx
    (onboarding)/
      onboarding/
        page.tsx
    (app)/
      layout.tsx
      dashboard/
        page.tsx
      surgeries/
        page.tsx
        new/
          page.tsx
        [surgeryId]/
          page.tsx
          loading.tsx
      ask/
        page.tsx
      library/
        page.tsx
        new/
          page.tsx
        [itemId]/
          page.tsx
      stats/
        page.tsx
      settings/
        page.tsx
    api/
      ai/
        chat/
          route.ts
        summarize-surgery/
          route.ts
        embed/
          route.ts
    layout.tsx
    page.tsx
    globals.css
  components/
    app-shell/
      app-header.tsx
      app-sidebar.tsx
      mobile-nav.tsx
      command-menu.tsx
    surgeries/
      surgery-list.tsx
      surgery-table.tsx
      surgery-card.tsx
      surgery-page-header.tsx
      surgery-editor.tsx
      surgery-metadata-panel.tsx
      surgery-media-gallery.tsx
      surgery-implant-list.tsx
      surgery-ai-summary.tsx
    library/
      library-list.tsx
      library-card.tsx
      library-editor.tsx
      library-link-panel.tsx
    ai/
      ask-panel.tsx
      ai-chat.tsx
      ai-citation-list.tsx
      suggested-questions.tsx
    dashboard/
      activity-chart.tsx
      billing-summary.tsx
      learning-insights.tsx
      implant-stats.tsx
    media/
      file-uploader.tsx
      media-grid.tsx
      media-viewer.tsx
    ui/
      button.tsx
      dialog.tsx
      dropdown-menu.tsx
      input.tsx
      textarea.tsx
      tabs.tsx
      toast.tsx
  features/
    auth/
      actions.ts
      schemas.ts
    surgeries/
      actions.ts
      queries.ts
      schemas.ts
      types.ts
    library/
      actions.ts
      queries.ts
      schemas.ts
      types.ts
    ai/
      actions.ts
      prompts.ts
      retrieval.ts
      embeddings.ts
      schemas.ts
      service.ts
    dashboard/
      queries.ts
      types.ts
    billing/
      calculations.ts
      schemas.ts
  lib/
    supabase/
      browser.ts
      server.ts
      middleware.ts
      admin.ts
    auth/
      require-user.ts
    db/
      types.ts
    utils/
      cn.ts
      dates.ts
      money.ts
      format.ts
  supabase/
    migrations/
    seed.sql
    policies/
  tests/
    unit/
    e2e/
  public/
    brand/
  middleware.ts
  next.config.ts
  tailwind.config.ts
  tsconfig.json
  package.json
```

## 15. Funcionalidades V1

### Registro quirurgico

- crear cirugia
- editar pagina de cirugia
- registrar informacion basica
- registrar contexto del paciente
- registrar diagnostico
- registrar procedimiento
- registrar implantes
- subir fotos
- subir radiografias
- subir videos
- subir documentos
- escribir observaciones quirurgicas
- escribir aprendizajes personales
- guardar perlas de adjuntos
- etiquetar casos
- marcar favoritos o casos importantes
- filtrar y buscar cirugias

### IA

- generar resumen IA de una cirugia
- chat global sobre cirugias y biblioteca
- busqueda semantica
- respuestas con citas internas
- resumen de experiencia por tema
- deteccion de implantes y procedimientos en texto libre
- sugerencias de etiquetas
- sugerencias de recursos relacionados

### Biblioteca

- crear nota
- subir PDF
- guardar enlace
- guardar video
- resumir recurso con IA
- etiquetar recurso
- enlazar recurso con cirugias
- buscar en biblioteca

### Dashboard

- estadisticas de actividad quirurgica
- estadisticas por procedimiento
- estadisticas por hospital
- estadisticas por implante
- evolucion temporal
- facturacion: pago, facturado, cobrado
- aprendizajes destacados
- temas frecuentes

### Productividad

- command menu
- busqueda global
- filtros guardados
- plantillas de cirugia futuras
- subida rapida desde movil
- vistas responsive

## 16. No incluido en V1

- gestion hospitalaria
- agenda de pacientes
- seguimiento clinico longitudinal de pacientes
- comunicacion con pacientes
- integracion con historia clinica electronica
- facturacion fiscal completa
- prescripcion
- consentimiento informado automatizado
- DICOM viewer avanzado
- trabajo multiusuario complejo
- permisos por equipo
- app nativa
- modo offline completo

## 17. Diseno visual

La interfaz debe evitar parecer software medico tradicional.

Direccion:

- fondo claro, sobrio y limpio
- tipografia elegante y legible
- paginas con sensacion editorial
- sidebar discreta
- tablas densas pero bonitas
- cards solo cuando aporten claridad
- editor amplio y centrado
- panel IA siempre cercano
- galerias multimedia cuidadas
- microinteracciones sutiles

Layout recomendado:

- desktop: sidebar + contenido central + panel derecho contextual
- iPad: sidebar colapsable + contenido flexible
- iPhone: navegacion inferior + paginas apiladas + acciones rapidas

La pagina de cirugia debe ser el elemento mas cuidado del producto.

## 18. Estrategia responsive

Desktop:

- ideal para revisar, buscar, analizar y completar casos
- tablas completas
- dashboard amplio
- panel IA lateral

iPad:

- ideal para revisar casos y anadir notas
- layouts de dos columnas cuando sea posible
- subida de imagenes/documentos fluida

iPhone:

- ideal para captura rapida postcirugia
- nueva cirugia en pocos toques
- dictado o escritura corta
- subir fotos y videos
- registrar aprendizaje del dia

La V1 debe funcionar perfectamente en los tres formatos.

## 19. Plan de implementacion

### Fase 1: Fundacion

- inicializar Next.js 15
- configurar TypeScript y Tailwind
- crear tema visual base
- configurar Supabase Auth
- crear layouts de auth y app
- crear navegacion responsive

### Fase 2: Modelo quirurgico

- crear migraciones Supabase
- crear tablas de cirugias, hospitales, implantes, media y tags
- activar RLS por `user_id`
- crear storage privado
- implementar CRUD de cirugias

### Fase 3: Pagina de cirugia

- construir editor/pagina tipo Notion
- campos estructurados
- bloques narrativos
- implantes
- media galleries
- documentos
- guardado robusto

### Fase 4: Biblioteca

- crear biblioteca
- subir PDFs y enlaces
- notas
- tags
- enlaces con cirugias

### Fase 5: IA

- embeddings con pgvector
- indexacion de cirugias y biblioteca
- busqueda semantica
- resumen de cirugia
- chat Ask OrthoLog
- citas internas en respuestas

### Fase 6: Dashboard

- actividad quirurgica
- implantes
- hospitales
- roles
- facturacion
- aprendizaje

### Fase 7: Pulido

- responsive fino en desktop/iPad/iPhone
- empty states
- carga y errores
- exportacion basica
- tests criticos
- hardening de privacidad

## 20. Criterios de aceptacion V1

- el usuario puede registrarse y acceder a su espacio personal
- el usuario puede crear una cirugia como pagina completa
- cada cirugia contiene campos estructurados y texto libre
- el usuario puede subir fotos, radiografias, videos y documentos
- el usuario puede registrar implantes
- el usuario puede escribir observaciones, aprendizajes y perlas
- la IA puede resumir una cirugia
- la IA puede responder preguntas sobre cirugias registradas
- las respuestas de IA incluyen casos o documentos fuente
- el usuario puede crear y consultar biblioteca
- la biblioteca puede enlazarse con cirugias
- el dashboard muestra actividad, facturacion y aprendizaje
- la app es usable en ordenador, iPad e iPhone
- RLS impide acceso entre usuarios

## 21. Riesgos y decisiones pendientes

Riesgos:

- privacidad de datos clinicos
- uso de imagenes potencialmente identificables
- calidad de la busqueda semantica si los registros son incompletos
- coste de almacenamiento de video
- coste de embeddings e IA con muchos casos
- necesidad futura de anonimizar automaticamente archivos y texto

Decisiones pendientes:

- idioma principal de la interfaz
- proveedor de IA
- estrategia de anonimizaion antes de IA
- si se permitira guardar datos identificativos o se forzara seudonimizacion
- tamano maximo de videos en V1
- formato del editor: bloques completos o markdown enriquecido
- si la facturacion sera solo tracking simple o evolucionara a modulo contable

## 22. Recomendacion final

La V1 debe obsesionarse con una sola experiencia:

> Salgo de quirofano, abro OrthoLog AI, registro lo importante en pocos minutos y ese conocimiento queda disponible para siempre.

Si OrthoLog AI consigue que cada cirugia se convierta en memoria, aprendizaje y estadistica consultable por IA, el producto tendra una identidad clara y mucho mas potente que un gestor hospitalario tradicional.
