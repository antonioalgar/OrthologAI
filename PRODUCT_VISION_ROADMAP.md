# OrthoLog AI - Vision de producto y roadmap definitivo

## 1. Definicion final del producto

OrthoLog AI es el segundo cerebro profesional de un cirujano ortopedico, construido alrededor de su experiencia quirurgica.

No es un ERP. No es un gestor hospitalario. No es un Notion generico para traumatologos. No es una biblioteca academica aislada.

Es una herramienta diaria para capturar, recuperar y transformar experiencia profesional real en criterio quirurgico acumulado.

La promesa central es:

> Registrar cada cirugia importante en menos de dos minutos y poder recuperar cualquier detalle util durante los proximos 10-20 anhos.

La unidad principal del producto es la cirugia.

Todo lo demas existe para enriquecer o reutilizar esa experiencia:

- Inbox
- aprendizajes
- perlas de mentores
- imagenes
- videos
- documentos
- implantes
- complicaciones
- seguimiento
- biblioteca
- IA
- estadisticas
- proyectos futuros
- timeline profesional

## 2. Revision critica de la arquitectura

### 2.1 Lo que esta bien encaminado

La arquitectura actual acierta en cinco decisiones importantes:

1. Cirugia como nucleo.
   Esto evita que el producto se disperse. La experiencia profesional del cirujano nace, en gran parte, de casos reales.

2. Inbox como red de seguridad.
   Es imprescindible porque en la vida clinica real no siempre hay tiempo para organizar. Capturar primero y ordenar despues es el patron correcto.

3. IA como capa transversal.
   La IA no debe ser una pantalla aislada. Debe ayudar a resumir, encontrar, relacionar y reducir trabajo.

4. Vision longitudinal.
   El producto debe estar preparado para comparar etapas de la carrera, no solo para listar casos.

5. MVP estrecho.
   La mayor amenaza del producto es volverse grande antes de volverse habitual.

### 2.2 Incoherencias detectadas

#### Riesgo 1: Vision profesional demasiado amplia demasiado pronto

Congresos, cursos, fellowships, publicaciones, proyectos, objetivos y timeline son valiosos a largo plazo, pero si entran demasiado pronto pueden convertir OrthoLog AI en una plataforma pesada.

Decision:

Mantenerlos en la vision, pero fuera del MVP y fuera de la v1 operativa salvo como relaciones ligeras o notas dentro de Biblioteca/Inbox.

#### Riesgo 2: Duplicidad entre Biblioteca, Inbox y Proyectos

Un paper, una idea o una nota de congreso podria vivir en varios sitios. Eso puede crear confusion.

Decision:

- Inbox es temporal.
- Biblioteca es conocimiento guardado.
- Proyectos no deben existir como modulo completo hasta que haya suficiente masa critica de casos.

En MVP/v1, una idea de investigacion puede ser simplemente un item del Inbox o una nota de Biblioteca etiquetada como `idea`.

#### Riesgo 3: Seguimiento y PROMs pueden romper la simplicidad

Seguimiento, complicaciones, revisiones y PROMs son muy importantes para calidad quirurgica, pero pueden transformar el producto en seguimiento clinico de pacientes.

Decision:

Incluir en v1 solo campos simples de seguimiento/complicacion si son muy rapidos de registrar. PROMs estructurados quedan para v2.

#### Riesgo 4: Dashboard puede caer en metrica decorativa

Graficas y KPIs pueden parecer profesionales pero no ayudar al trabajo diario.

Decision:

El Dashboard debe mostrar solo:

- pendientes
- cirugias recientes
- Inbox sin organizar
- accion de nueva cirugia
- busqueda/Ask rapido
- resumen mensual util

Todo lo demas pertenece a Estadisticas.

#### Riesgo 5: IA demasiado pronto puede ocultar problemas de producto

Si la captura manual no es excelente, la IA no lo arreglara.

Decision:

Primero hacer que registrar cirugias sea rapidisimo y consistente. Despues introducir IA para reducir friccion, no para justificar complejidad.

### 2.3 Funcionalidades innecesarias para el MVP

Dejaria fuera deliberadamente del MVP:

- congresos como modulo propio
- cursos como modulo propio
- fellowships como modulo propio
- publicaciones como modulo propio
- proyectos de investigacion completos
- objetivos profesionales estructurados
- timeline avanzado
- PROMs estructurados
- colaboracion multiusuario
- integraciones hospitalarias
- DICOM avanzado
- plantillas complejas
- automatizaciones
- analitica avanzada
- protocolos vivos
- generacion de abstracts

No porque no sean valiosas, sino porque antes necesitamos el habito diario.

## 3. Principios no negociables

### 3.1 Menos de dos minutos

Registrar una cirugia util nunca debe llevar mas de dos minutos.

Si una funcion aumenta ese tiempo, debe quedar fuera o ser opcional.

### 3.2 Cirugia primero

La cirugia es la entidad principal. El resto son capas relacionadas.

### 3.3 Captura antes que organizacion

El usuario debe poder guardar algo sin decidir donde va.

### 3.4 Recuperacion en segundos

La captura solo tiene sentido si despues se puede encontrar.

### 3.5 IA para reducir trabajo

La IA debe resumir, etiquetar, encontrar y relacionar. No debe generar tareas extra.

### 3.6 Cero decoracion inutil

Cada bloque de UI debe responder:

- me ahorra tiempo?
- me ayuda a decidir?
- mejora mi criterio profesional?

### 3.7 Preparado para 20 anhos

Cada dato importante debe tener fecha, contexto y relaciones para poder analizar evolucion profesional.

### 3.8 Privacidad desde el inicio

El producto debe favorecer seudonimizacion y evitar datos identificativos innecesarios.

## 4. Version 1.0 definitiva

### 4.1 Que debe ser OrthoLog AI v1.0

OrthoLog AI v1.0 debe ser:

- un registro quirurgico personal extremadamente rapido
- una bandeja de captura universal
- una pagina viva por cirugia
- una base consultable de aprendizajes y perlas
- una biblioteca simple conectada a casos
- una vista de estadisticas utiles
- una base preparada para IA y busqueda semantica

### 4.2 Que no debe ser OrthoLog AI v1.0

No debe ser:

- un gestor de pacientes
- un sistema de historia clinica
- un ERP
- un gestor academico completo
- un Notion medico
- una plataforma de investigacion
- una app de seguimiento clinico completa
- una herramienta de facturacion fiscal

## 5. Alcance por prioridad

## MVP: habito diario

### Objetivo

Conseguir que el usuario registre todas sus cirugias.

### Incluye

#### 1. Dashboard de accion

Por que:

Es la puerta diaria. Debe decir que hacer ahora.

Debe mostrar:

- boton principal: nueva cirugia
- Inbox pendiente
- cirugias recientes
- cirugias incompletas
- facturacion pendiente simple
- acceso rapido a buscar/preguntar

#### 2. Nueva cirugia rapida

Por que:

Es el flujo mas importante del producto.

Campos minimos:

- fecha
- procedimiento
- hospital
- rol

Campos rapidos opcionales:

- diagnostico
- paciente anonimizado
- implantes
- pago
- observacion
- aprendizaje
- perla

#### 3. Pagina de cirugia

Por que:

Cada cirugia debe convertirse en memoria reutilizable.

Debe incluir:

- informacion basica
- paciente anonimizado
- diagnostico
- procedimiento
- implantes
- media
- documentos
- observaciones
- aprendizaje
- perlas
- facturacion simple
- resumen IA simulado/preparado

#### 4. Inbox

Por que:

Evita perder informacion.

Debe aceptar:

- nota
- foto
- video
- audio
- PDF
- enlace
- paper
- idea
- perla

En MVP puede ser visual o basico, pero debe estar presente en el modelo mental.

#### 5. Registro quirurgico

Por que:

Permite encontrar y revisar casos.

Debe incluir:

- lista/table compacta
- busqueda
- filtros basicos
- badges
- acceso rapido a caso

#### 6. Biblioteca simple

Por que:

El conocimiento externo debe poder conectarse con casos, pero sin convertirse aun en modulo academico pesado.

Debe incluir:

- papers
- PDFs
- videos
- enlaces
- notas

#### 7. Estadisticas basicas

Por que:

Debe dar retorno de valor desde temprano.

Debe mostrar:

- cirugias por periodo
- procedimientos frecuentes
- hospitales
- implantes
- facturacion simple

### Fuera del MVP

- IA real avanzada
- PROMs
- timeline avanzado
- cursos/congresos como entidades completas
- proyectos de investigacion
- publicaciones
- objetivos profesionales estructurados

## v1: producto diario completo

### Objetivo

Que OrthoLog AI sea util todos los dias y que cualquier caso pueda encontrarse en segundos.

### Incluye

#### 1. Persistencia real

Por que:

Sin datos reales no hay segundo cerebro.

Incluye:

- Supabase
- autenticacion
- base de datos
- storage privado
- RLS

#### 2. Inbox funcional

Por que:

Es el mecanismo de captura mas importante despues de nueva cirugia.

Incluye:

- guardar items
- asignar a cirugia
- convertir en aprendizaje/perla
- enviar a biblioteca
- archivar

#### 3. Busqueda global real

Por que:

El valor acumulado depende de recuperar.

Debe buscar:

- cirugias
- procedimientos
- diagnosticos
- implantes
- aprendizajes
- perlas
- biblioteca

#### 4. IA inicial util

Por que:

Debe ahorrar tiempo inmediatamente.

Incluye:

- resumen de cirugia
- tags sugeridos
- deteccion de implantes/procedimientos en texto
- estado de completitud

No incluye todavia:

- razonamiento longitudinal complejo
- generacion academica
- predicciones

#### 5. Seguimiento ligero

Por que:

Permite empezar a capturar resultados sin crear un modulo pesado.

Incluye:

- nota de seguimiento
- fecha
- complicacion si/no
- revision si/no
- documento/imagen

No incluye:

- PROMs complejos
- formularios de paciente
- seguimiento automatizado

#### 6. Biblioteca conectada

Por que:

Un paper vale mas cuando esta conectado a cirugias.

Incluye:

- relacionar paper/recurso con cirugia
- tags
- resumen IA opcional

## v2: aprendizaje e inteligencia longitudinal

### Objetivo

Convertir cirugias acumuladas en aprendizaje estructurado y conocimiento consultable.

### Incluye

#### 1. Ask OrthoLog real con citas

Por que:

Permite recuperar experiencia en lenguaje natural.

Preguntas objetivo:

- muestrame mis revisiones de LCA
- que aprendi sobre osteotomias?
- que implantes use en PTR?
- que complicaciones tuve en MPFL?

#### 2. Busqueda semantica

Por que:

El usuario no siempre recordara palabras exactas.

#### 3. Casos similares

Por que:

Antes de operar, ver experiencia previa similar mejora decision y preparacion.

#### 4. Aprendizajes agrupados

Por que:

Permite ver patrones de criterio.

#### 5. Seguimiento y resultados ampliados

Por que:

La calidad quirurgica no termina en el quirofano.

Incluye:

- complicaciones estructuradas
- revisiones
- outcomes simples
- PROMs seleccionados si aportan valor real

#### 6. Evolucion tecnica

Por que:

Es una de las promesas diferenciales del producto.

Ejemplo:

> Como cambio mi tecnica de revision de LCA entre 2026 y 2035?

## Largo plazo: memoria profesional completa

### Objetivo

Construir una memoria profesional de decadas.

### Incluye

#### 1. Timeline profesional

Por que:

Permite entender la carrera como evolucion, no como archivo.

Puede incluir:

- hitos
- cursos
- congresos
- fellowships
- publicaciones
- primeros casos
- objetivos cumplidos

#### 2. Congresos, cursos y fellowships conectados

Por que:

Solo tienen sentido si se relacionan con cambios reales en practica, papers, mentores o cirugias.

#### 3. Proyectos de investigacion

Por que:

La experiencia acumulada puede generar produccion academica.

Debe nacer desde:

- series de casos
- preguntas recurrentes
- complicaciones
- aprendizajes
- papers

#### 4. Objetivos profesionales

Por que:

Transforman memoria en direccion.

Ejemplos:

- mejorar revision de LCA
- publicar serie de MAT medial
- reducir complicaciones de MPFL

#### 5. Narrativa anual de carrera

Por que:

El producto debe ayudar a reflexionar sobre progreso real.

#### 6. Protocolos vivos

Por que:

La practica cambia con experiencia, evidencia y resultados.

Pero esto solo debe llegar cuando haya suficiente dato propio.

## 6. Decisiones deliberadas de exclusion

### 6.1 No construir modulo de pacientes completo

Motivo:

El producto no es una historia clinica. El paciente es contexto anonimizado.

### 6.2 No construir agenda quirurgica hospitalaria

Motivo:

No queremos competir con sistemas hospitalarios ni convertir el producto en gestion operativa externa.

### 6.3 No construir facturacion completa

Motivo:

Facturacion simple ayuda. Contabilidad completa distrae.

### 6.4 No construir academia completa en v1

Motivo:

Publicaciones, congresos y proyectos son valiosos, pero solo despues de consolidar registro quirurgico.

### 6.5 No construir PROMs avanzados en MVP

Motivo:

Son importantes, pero pueden destruir la velocidad de captura inicial.

### 6.6 No construir colaboracion multiusuario pronto

Motivo:

La propuesta central es memoria profesional individual.

### 6.7 No construir IA espectacular antes de datos reales

Motivo:

La IA solo sera buena si la captura es buena.

## 7. Producto definitivo recomendado

La mejor version 1.0 de OrthoLog AI no es la mas grande. Es esta:

> Una aplicacion personal donde registro cada cirugia en menos de dos minutos, guardo cualquier material en un Inbox, convierto cada caso en aprendizaje, encuentro cualquier experiencia en segundos y empiezo a ver como evoluciona mi practica quirurgica.

Esta version tiene suficiente valor para usarse todos los dias y suficiente estructura para crecer durante 20 anhos.

## 8. Roadmap resumido

```txt
MVP
  Registrar todas mis cirugias y no perder informacion.

v1
  Encontrar cualquier caso, completar Inbox, persistencia real e IA inicial.

v2
  Convertir casos en aprendizaje, busqueda semantica, seguimiento y evolucion tecnica.

Largo plazo
  Memoria profesional completa: timeline, congresos, proyectos, publicaciones, objetivos y narrativa de carrera.
```

## 9. Criterio final para futuras decisiones

Toda nueva funcionalidad debe responder afirmativamente a una de estas preguntas:

1. Me ayuda a registrar una experiencia util en menos de dos minutos?
2. Me ayuda a recuperar conocimiento en segundos?
3. Me ayuda a aprender de mis casos?
4. Me ayuda a entender como evoluciona mi practica?
5. Me ayuda a ser mejor cirujano y mejor profesional dentro de 10-20 anhos?

Si no responde a ninguna, queda fuera.

Si responde a una, aun debe evaluarse si pertenece al MVP, v1, v2 o largo plazo.
