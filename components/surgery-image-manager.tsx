"use client";

import { useCallback, useEffect, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { SurgeryImage } from "@/lib/surgeries/types";

const BUCKET = "surgery-images";
const IMAGE_CATEGORIES = ["RX", "RM", "TAC", "Artroscopia", "Intraoperatoria", "Clinica", "Planificacion", "Seguimiento", "Otro"];

type ImageWithUrl = SurgeryImage & {
  signedUrl: string | null;
};

export function SurgeryImageManager({ surgeryId }: { surgeryId: string }) {
  const [images, setImages] = useState<ImageWithUrl[]>([]);
  const [category, setCategory] = useState(IMAGE_CATEGORIES[0]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const loadImages = useCallback(async () => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;

    const { data, error: queryError } = await supabase
      .from("surgery_images")
      .select("*")
      .eq("surgery_id", surgeryId)
      .order("created_at", { ascending: false });

    if (queryError) {
      setError(queryError.message);
      return;
    }

    const rows = (data ?? []) as SurgeryImage[];
    const signed = await Promise.all(
      rows.map(async (image) => {
        const { data: signedData } = await supabase.storage.from(BUCKET).createSignedUrl(image.storage_path, 60 * 60);
        return { ...image, signedUrl: signedData?.signedUrl ?? null };
      })
    );

    setImages(signed);
  }, [surgeryId]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;

    setUploading(true);
    setError("");

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setUploading(false);
      setError("Supabase no esta configurado.");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setUploading(false);
      setError("Sesion no disponible.");
      return;
    }

    for (const [index, file] of Array.from(files).entries()) {
      const storagePath = `${user.id}/${surgeryId}/${Date.now()}-${index}-${safeFileName(file.name)}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, file, {
        contentType: file.type || "image/jpeg"
      });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { error: insertError } = await supabase.from("surgery_images").insert({
        user_id: user.id,
        surgery_id: surgeryId,
        bucket: BUCKET,
        storage_path: storagePath,
        file_name: file.name,
        content_type: file.type,
        file_size: file.size,
        category
      });

      if (insertError) {
        setError(insertError.message);
        setUploading(false);
        return;
      }
    }

    setUploading(false);
    await loadImages();
  }

  return (
    <section className="mt-10 border-t border-line pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Imagenes</h2>
          <p className="mt-1 text-sm text-graphite">Sube varias imagenes y clasificalas para encontrarlas despues.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="text-sm font-medium text-ink">
            Categoria
            <select className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-cobalt" value={category} onChange={(event) => setCategory(event.target.value)}>
              {IMAGE_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white shadow-soft hover:bg-black sm:self-end">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
            {uploading ? "Subiendo..." : "Subir imagenes"}
            <input className="sr-only" type="file" accept="image/*" multiple onChange={(event) => uploadFiles(event.target.files)} disabled={uploading} />
          </label>
        </div>
      </div>

      {error ? <p className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-ember">{error}</p> : null}

      {images.length ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <figure key={image.id} className="overflow-hidden rounded-lg border border-line bg-white">
              <div className="relative aspect-[4/3] bg-mist">
                {image.signedUrl ? <img src={image.signedUrl} alt={image.file_name || "Imagen quirurgica"} className="h-full w-full object-cover" /> : null}
              </div>
              <figcaption className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
                <span className="truncate text-ink">{image.file_name || "Imagen"}</span>
                <span className="shrink-0 rounded-full bg-mist px-2 py-1 text-graphite">{image.category || "Sin categoria"}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-line bg-white p-6 text-sm text-graphite">
          Todavia no hay imagenes asociadas a esta cirugia.
        </div>
      )}
    </section>
  );
}

function safeFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
