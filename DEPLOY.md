# OrthoLog AI - Deploy en Vercel

Este documento deja el MVP preparado para desplegar en Vercel. No sustituye una prueba final en produccion antes de usar datos reales.

## 1. Requisitos previos

- Proyecto Supabase creado y migraciones SQL aplicadas.
- Bucket privado `surgery-images` creado mediante la migracion `0002_surgery_images_and_history.sql`.
- Repositorio subido a GitHub, GitLab o Bitbucket.
- Cuenta de Vercel con acceso al repositorio.

## 2. Variables de entorno

Configurar en Vercel, dentro de Project Settings > Environment Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://zhkymruaeewhpyhbddxz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_4xkYBgd_sOPgUT-dgZNckQ_E6f-bxEf
```

Aplicar las variables al menos a:

- Production
- Preview
- Development, si se va a usar `vercel dev`

## 3. Crear proyecto en Vercel

1. Entrar en Vercel.
2. Crear un nuevo proyecto.
3. Importar el repositorio de OrthoLog AI.
4. Framework preset: Next.js.
5. Build command: `npm run build`.
6. Output directory: dejar el valor por defecto de Next.js.
7. Instalar y desplegar.

## 4. Configurar Supabase Auth

Cuando Vercel asigne el dominio final, configurar Supabase:

1. Ir a Supabase Dashboard.
2. Authentication > URL Configuration.
3. Site URL: dominio principal de produccion, por ejemplo:

```text
https://ortholog-ai.vercel.app
```

4. Redirect URLs: anadir el dominio de produccion y, si se usan previews, el patron de preview necesario.

Ejemplo minimo:

```text
https://ortholog-ai.vercel.app/**
```

## 5. Verificacion post-deploy

Abrir la URL HTTPS de Vercel y comprobar:

- Login.
- Logout.
- Crear una cirugia.
- Buscar la cirugia creada.
- Abrir la pagina individual.
- Subir varias imagenes.
- Cerrar sesion y volver a entrar.
- Confirmar que las imagenes siguen visibles.
- Confirmar que no aparece overlay rojo de Next.

## 6. Notas de seguridad

- No usar service role key en el frontend.
- Mantener `NEXT_PUBLIC_SUPABASE_ANON_KEY` como publishable key publica.
- RLS debe permanecer activo en `surgeries`, `surgery_images` y tablas relacionadas.
- Las imagenes quirurgicas estan en un bucket privado y se sirven mediante URLs firmadas.

## 7. Estado actual del MVP

Incluido:

- Autenticacion con Supabase Auth.
- Registro de cirugias.
- Persistencia en Supabase.
- Listado y busqueda.
- Pagina individual de cirugia.
- Edicion de cirugia.
- Subida y visualizacion de imagenes.
- Autocompletado basado en historial.

No incluido todavia:

- IA.
- Inbox.
- Biblioteca.
- Despliegue automatico.
