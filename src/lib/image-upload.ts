"use client";

import { SUPABASE_BUCKET } from "@/lib/constants";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

const MAX_IMAGE_WIDTH = 1200;
const IMAGE_QUALITY = 0.8;

async function compressImageFile(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_WIDTH / bitmap.width);
  const targetWidth = Math.round(bitmap.width * scale);
  const targetHeight = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    return file;
  }

  context.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

  const webpBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", IMAGE_QUALITY);
  });

  const nextName = file.name.replace(/\.[^/.]+$/, "") || "upload";

  if (webpBlob) {
    return new File([webpBlob], `${nextName}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  }

  const jpegBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", IMAGE_QUALITY);
  });

  if (!jpegBlob) {
    return file;
  }

  return new File([jpegBlob], `${nextName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

export async function uploadImage(file: File, folder: string, slugSeed: string) {
  const supabase = createBrowserSupabaseClient();
  const compressedFile = await compressImageFile(file);
  const sanitizedSeed = slugify(slugSeed) || "image";
  const extension = compressedFile.type === "image/jpeg" ? "jpg" : "webp";
  const path = `${folder}/${sanitizedSeed}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${extension}`;

  const { error } = await supabase.storage.from(SUPABASE_BUCKET).upload(path, compressedFile, {
    cacheControl: "31536000",
    contentType: compressedFile.type,
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(path);

  return publicUrl;
}
