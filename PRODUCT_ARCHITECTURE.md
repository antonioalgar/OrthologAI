# OrthoLog AI - Arquitectura funcional revisada

## 0. Vision

OrthoLog AI es un segundo cerebro profesional para un cirujano ortopedico.

La vision a largo plazo es acompanar toda una carrera profesional durante 10, 20 o mas anhos. Pero el MVP debe ser extremadamente simple: una herramienta que se abra todos los dias, que permita capturar experiencia real en menos de dos minutos y que, con el tiempo, convierta miles de cirugias en memoria, aprendizaje y criterio profesional.

El filtro principal para cualquier decision de producto es:

> Esto me ayuda a ser mejor cirujano y mejor profesional dentro de 10 o 20 anhos?

Si la respuesta es no, no pertenece a OrthoLog AI ahora.

Si la respuesta es si, todavia debe pasar un segundo filtro:

> Esto ayuda a registrar una experiencia util en menos de dos minutos o a recuperar conocimiento en segundos?

Si no supera este segundo filtro, probablemente no pertenece al MVP.

## 1. Principios rectores

### 1.1 El MVP debe ser radicalmente simple

OrthoLog AI no debe convertirse en un ERP, un CRM medico, un HIS ni un Notion generico para traumatologos.

El MVP debe resolver pocos trabajos, pero resolverlos muy bien:

- registrar cirugias
- no perder informacion
- encontrar casos rapido
- guardar aprendizajes
- preparar la base para IA futura

Todo lo demas debe esperar.

### 1.2 La cirugia es el nucleo del sistema

Aunque la vision final sea una memoria profesional completa, la cirugia debe seguir siendo la entidad principal.

La mayoria de elementos importantes nacen o se justifican alrededor de cirugias:

- aprendizajes
- perlas de mentores
- complicaciones
- seguimiento
- implantes
- fotografias
- videos
- papers relacionados
- proyectos de investigacion
- publicaciones
- objetivos profesionales
- evolucion tecnica

Arquitectonicamente, OrthoLog AI debe crecer alrededor de la cirugia, no alrededor de modulos independientes.

### 1.3 Capturar ahora, organizar despues

El Inbox es una pieza fundamental.

Debe permitir guardar en segundos:

- fotografia
- video
- nota escrita
- nota de voz
- paper
- PDF
- enlace
- idea
- perla de mentor
- documento

El usuario no debe verse obligado a decidir en el momento si algo pertenece a una cirugia, a un proyecto, a la biblioteca o a un objetivo. Primero se captura. Despues se organiza.

### 1.4 Habitos antes que funcionalidades

El exito del producto no depende de tener muchas pantallas. Depende de que el cirujano lo use todos los dias.

Cada nueva funcion debe evaluarse con esta pregunta:

> Esto aumenta la probabilidad de que use OrthoLog AI todos los dias?

Si no, debe retrasarse.

### 1.5 Menos pantallas, mas utilidad

Una aplicacion imprescindible no es necesariamente grande. Debe ser rapida, clara y confiable.

El MVP debe evitar:

- navegacion profunda
- formularios largos
- campos obligatorios innecesarios
- dashboards decorativos
- metricas de relleno
- modulos academicos prematuros
- configuracion excesiva

### 1.6 La IA debe reducir friccion

La IA no debe crear trabajo extra.

Debe ayudar a:

- resumir
- etiquetar
- encontrar
- relacionar
- recordar
- detectar informacion incompleta
- responder preguntas con fuentes

No debe obligar al usuario a revisar sugerencias irrelevantes constantemente.

### 1.7 El producto debe soportar evolucion longitudinal

Aunque no se implemente al inicio, la arquitectura debe permitir responder algun dia:

- como ha cambiado mi forma de hacer una revision de LCA entre 2026 y 2035?
- que aprendi de mis complicaciones?
- que tecnicas abandone?
- que implantes use mas en cada etapa?
- que cursos o mentores cambiaron mi practica?
- que outcomes obtuve?

Esto exige guardar datos con fecha, contexto, relaciones y trazabilidad.

## 2. Arquitectura funcional

### 2.1 Modelo mental

El producto se organiza como un sistema centrado en cirugias, con entidades relacionadas alrededor.

```txt
Inbox
  -> Cirugia
      -> Aprendizajes
      -> Perlas
      -> Media
      -> Implantes
      -> Complicaciones
      -> Seguimiento
      -> Biblioteca
      -> Proyectos
      -> Objetivos
      -> Estadisticas
      -> Ask OrthoLog
```

La cirugia es el centro operativo.

Inbox es la puerta de entrada.

Ask OrthoLog es la capa de recuperacion.

Estadisticas es la capa de lectura longitudinal.

Biblioteca, proyectos, congresos y carrera son capas de crecimiento, no el centro del MVP.

### 2.2 Secciones del producto

#### Dashboard

Funcion:

- decidir que hacer ahora
- registrar nueva cirugia
- ver pendientes criticos
- abrir casos recientes
- entrar al Inbox
- preguntar rapido

No debe ser decorativo.

Debe responder:

- que tengo pendiente?
- que opere recientemente?
- que necesito completar?
- que debo revisar?
- como registro una nueva cirugia ya?

#### Inbox

Funcion:

- capturar sin decidir

Debe aceptar:

- foto
- video
- nota
- voz
- paper
- PDF
- enlace
- idea
- perla

Debe permitir despues:

- asignar a cirugia
- convertir en aprendizaje
- guardar en biblioteca
- crear proyecto futuro
- archivar

#### Nueva cirugia

Funcion:

- crear una cirugia util en menos de dos minutos

Campos minimos:

- fecha
- procedimiento
- hospital opcional pero recomendado
- mi rol opcional pero recomendado

Todo lo demas debe poder completarse despues.

#### Pagina de cirugia

Funcion:

- ser la memoria viva de un caso

Debe contener:

- informacion basica
- paciente anonimizado
- diagnostico
- procedimiento
- implantes
- fotos
- RX
- videos
- documentos
- observaciones quirurgicas
- que he aprendido hoy
- perlas del adjunto
- resumen IA
- facturacion
- seguimiento futuro
- complicaciones futuras

#### Biblioteca

Funcion:

- guardar conocimiento externo conectado con casos

Debe empezar simple:

- papers
- PDFs
- enlaces
- videos
- notas

En MVP no debe competir con la cirugia. Su valor aparece cuando un recurso se relaciona con casos concretos.

#### Ask OrthoLog

Funcion:

- recuperar cualquier experiencia en segundos

Debe evolucionar por fases:

1. busqueda simple
2. busqueda semantica
3. respuestas con citas
4. analisis longitudinal

#### Estadisticas

Funcion:

- entender actividad, aprendizaje y evolucion

En MVP debe ser simple:

- cirugias por periodo
- procedimientos frecuentes
- hospitales
- implantes
- facturacion basica

Mas adelante:

- complicaciones
- revisiones
- outcomes
- evolucion tecnica
- learning curves

## 3. Como nace y se reutiliza un dato

### 3.1 Ejemplo: foto intraoperatoria

1. El usuario toma una foto.
2. La envia al Inbox.
3. Mas tarde la vincula a una cirugia.
4. La IA sugiere caption y tags.
5. La foto queda disponible en la pagina de cirugia.
6. Ask OrthoLog puede recuperarla como fuente visual.
7. En el futuro puede alimentar seguimiento, presentaciones o proyectos.

### 3.2 Ejemplo: perla de mentor

1. El usuario captura una frase en Inbox.
2. La marca como perla.
3. Opcionalmente la relaciona con mentor, procedimiento o cirugia.
4. La IA la etiqueta.
5. Semanas despues aparece al preguntar por ese procedimiento.
6. Anhos despues ayuda a reconstruir influencia profesional.

### 3.3 Ejemplo: cirugia de revision de LCA

1. Se crea con datos minimos en menos de dos minutos.
2. Se completan observaciones y aprendizaje.
3. Se vinculan implantes, fotos y RX.
4. Semanas despues se anade seguimiento.
5. Meses despues entra en una serie de casos.
6. Anhos despues sirve para comparar evolucion tecnica.

## 4. Modelo de datos prioritario

### 4.1 Cirugia

Entidad principal.

Obligatorios MVP:

- id
- user_id
- fecha
- procedimiento
- estado_de_completitud
- created_at
- updated_at

Opcionales MVP:

- hospital
- mi_rol
- cirujano_principal
- pago
- facturado
- cobrado
- paciente_anonimizado
- diagnostico
- lateralidad
- region
- implantes
- observaciones
- aprendizaje
- perlas
- tags

Futuro:

- complicaciones
- seguimiento
- outcomes
- PROMs
- revisiones
- proyectos asociados
- objetivos asociados

IA puede generar:

- titulo
- resumen
- tags
- estado de completitud
- implantes detectados
- procedimientos detectados
- casos similares
- preguntas sugeridas

### 4.2 Inbox Item

Obligatorios:

- id
- user_id
- tipo
- contenido o archivo
- estado
- created_at

Opcionales:

- titulo
- nota
- fecha_contexto
- surgery_id sugerido
- tags
- origen

Relaciones:

- puede convertirse en media
- puede asignarse a cirugia
- puede convertirse en aprendizaje
- puede convertirse en perla
- puede guardarse en biblioteca
- puede iniciar proyecto futuro

IA puede generar:

- tipo sugerido
- resumen
- tags
- destino sugerido
- transcripcion futura

### 4.3 Aprendizaje

Obligatorios:

- id
- user_id
- contenido
- fecha

Opcionales:

- surgery_id
- procedimiento
- importancia
- revisar_en
- tags

Relaciones:

- nace de cirugia o Inbox
- puede relacionarse con paper, mentor, objetivo o proyecto

IA puede generar:

- tema
- tags
- conexiones
- resumen longitudinal

### 4.4 Perla de mentor

Obligatorios:

- id
- user_id
- contenido
- fecha

Opcionales:

- mentor
- surgery_id
- procedimiento
- contexto
- importancia

Relaciones:

- cirugia
- mentor
- aprendizaje
- procedimiento

IA puede generar:

- clasificacion por tema
- relacion con casos similares
- resumen por mentor

### 4.5 Media

Obligatorios:

- id
- user_id
- tipo
- archivo o URL
- created_at

Opcionales:

- surgery_id
- inbox_item_id
- caption
- categoria
- anonimizado
- tags

Tipos:

- foto
- RX
- video
- documento
- audio

IA puede generar:

- caption
- tags
- transcripcion de audio/video futura
- deteccion de posible informacion identificativa futura

### 4.6 Biblioteca Item

Obligatorios:

- id
- user_id
- tipo
- titulo
- created_at

Opcionales:

- PDF
- URL
- autores
- anho
- notas
- tags
- procedimientos relacionados
- cirugias relacionadas

IA puede generar:

- resumen
- puntos clave
- tags
- cirugias relacionadas

### 4.7 Hospital

Obligatorios:

- id
- user_id
- nombre

Opcionales:

- ciudad
- notas

Relaciones:

- cirugias
- facturacion
- estadisticas

### 4.8 Implante

Obligatorios:

- id
- user_id
- nombre

Opcionales:

- marca
- modelo
- familia
- talla
- notas

Relaciones:

- cirugias
- procedimientos
- estadisticas

### 4.9 Seguimiento y resultados

No imprescindible en MVP, pero debe estar previsto.

Obligatorios futuros:

- id
- user_id
- surgery_id
- fecha

Opcionales futuros:

- notas
- estado clinico
- complicacion
- revision
- PROMs
- outcome
- vuelta a deporte
- imagenes

IA puede generar:

- resumen evolutivo
- comparacion con casos similares
- deteccion de patrones de complicaciones

### 4.10 Proyecto / Congreso / Publicacion / Objetivo

No deben dominar el MVP.

Deben existir como extensiones futuras relacionadas con cirugias.

Campos comunes futuros:

- id
- user_id
- tipo
- titulo
- fecha
- estado
- notas
- archivos
- relaciones

Relaciones:

- cirugias
- aprendizajes
- biblioteca
- mentores
- objetivos

IA puede generar:

- resumen
- relaciones sugeridas
- ideas de investigacion
- narrativa de carrera

## 5. Fases de evolucion

### Fase 1: registrar todas mis cirugias

Objetivo:

- crear el habito diario.

Incluye:

- Dashboard de accion
- Nueva cirugia rapida
- Pagina de cirugia
- Registro quirurgico
- Inbox visual o funcional basico
- Fotos/documentos como estructura
- Aprendizaje del dia
- Perlas
- Facturacion simple

Excluye:

- IA real compleja
- proyectos academicos
- congresos completos
- PROMs avanzados
- colaboracion

### Fase 2: encontrar cualquier caso en segundos

Objetivo:

- que la base quirurgica sea recuperable.

Incluye:

- busqueda global real
- filtros potentes
- tags
- normalizacion de procedimientos
- busqueda por implante, hospital, fecha, aprendizaje
- Ask OrthoLog inicial

### Fase 3: convertir cirugias en aprendizaje

Objetivo:

- que cada caso aumente el criterio quirurgico.

Incluye:

- resumen IA de cirugia
- extraccion de aprendizajes
- perlas agrupadas
- casos similares
- revision de aprendizajes
- deteccion de temas repetidos

### Fase 4: conectar aprendizaje con papers, congresos y proyectos

Objetivo:

- unir practica real con conocimiento academico.

Incluye:

- Biblioteca conectada
- papers enlazados a cirugias
- cursos/congresos como eventos simples
- ideas de investigacion
- proyectos basicos
- publicaciones/presentaciones relacionadas

### Fase 5: memoria profesional completa

Objetivo:

- comprender la evolucion de toda la carrera.

Incluye:

- timeline longitudinal
- objetivos profesionales
- outcomes y PROMs
- evolucion tecnica
- resumen anual de carrera
- mapas de mentores
- analisis de practica entre periodos
- investigacion asistida desde datos propios

## 6. Areas presentes desde el diseno aunque no se implementen aun

### 6.1 Seguimiento y resultados de pacientes

Debe estar previsto porque define calidad quirurgica.

Futuro:

- complicaciones
- revisiones
- PROMs
- vuelta a deporte
- seguimiento radiografico
- resultado funcional

No debe bloquear el MVP. Pero el modelo de cirugia debe permitir anadirlo despues.

### 6.2 Evolucion de practica profesional

La arquitectura debe guardar suficiente contexto para comparar periodos.

Ejemplo futuro:

> Como ha cambiado mi forma de hacer una revision de LCA entre 2026 y 2035?

Para responder, el sistema necesitara:

- fechas
- procedimientos normalizados
- observaciones quirurgicas
- implantes
- tecnicas
- aprendizajes
- complicaciones
- seguimiento
- papers/protocolos vinculados

Por eso, aunque el MVP sea simple, debe evitar datos completamente desestructurados sin fecha o relacion.

## 7. Decision de producto actual

El enfoque recomendado es:

1. Mantener la vision amplia.
2. Construir un MVP estrecho.
3. Hacer que la cirugia sea el nucleo.
4. Incluir Inbox como mecanismo de captura.
5. Posponer modulos academicos avanzados.
6. Preparar el modelo para seguimiento, outcomes y evolucion longitudinal.

La arquitectura debe permitir crecer, pero la interfaz diaria debe seguir siendo ligera.

## 8. Resumen ejecutivo

OrthoLog AI debe crecer asi:

```txt
Cirugias registradas
  -> casos recuperables
    -> aprendizaje acumulado
      -> conocimiento conectado
        -> memoria profesional longitudinal
```

La prioridad inmediata no es construir mucho. Es construir el habito.

Si el producto consigue que registrar una cirugia sea tan facil que ocurre todos los dias, entonces todo lo demas tendra sentido: IA, estadisticas, papers, congresos, proyectos y evolucion profesional.

Sin habito, no hay segundo cerebro.
