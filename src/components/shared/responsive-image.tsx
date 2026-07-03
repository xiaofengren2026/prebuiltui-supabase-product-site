/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type ResponsiveImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackLabel?: string;
  loading?: "eager" | "lazy";
  sizes?: string;
  width?: number;
  quality?: number;
};

function buildOptimizedImageUrl(
  src: string | null | undefined,
  width?: number,
  quality = 80,
) {
  if (!src) {
    return src;
  }

  try {
    const url = new URL(src);
    const marker = "/storage/v1/object/public/";

    if (!url.pathname.includes(marker)) {
      return src;
    }

    const publicPath = url.pathname.split(marker)[1];
    if (!publicPath) {
      return src;
    }

    const optimizedUrl = new URL(`/storage/v1/render/image/public/${publicPath}`, url.origin);

    if (width) {
      optimizedUrl.searchParams.set("width", String(width));
    }

    optimizedUrl.searchParams.set("quality", String(quality));
    optimizedUrl.searchParams.set("format", "webp");

    return optimizedUrl.toString();
  } catch {
    return src;
  }
}

export function ResponsiveImage({
  src,
  alt,
  className,
  containerClassName,
  fallbackLabel = "图片暂不可用",
  loading = "lazy",
  sizes = "100vw",
  width,
  quality = 80,
}: ResponsiveImageProps) {
  const [hasError, setHasError] = useState(false);

  const optimizedSrc = useMemo(
    () => buildOptimizedImageUrl(src, width, quality),
    [quality, src, width],
  );

  const showFallback = useMemo(() => !optimizedSrc || hasError, [hasError, optimizedSrc]);

  if (showFallback) {
    return (
      <div
        className={cn(
          "product-image-fallback flex h-full min-h-[220px] w-full items-center justify-center",
          containerClassName,
        )}
      >
        <span className="rounded-full border border-border bg-white/20 px-4 py-2 text-sm text-foreground-muted">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("h-full w-full overflow-hidden", containerClassName)}>
      <img
        src={optimizedSrc ?? undefined}
        alt={alt}
        className={cn("h-full w-full object-cover", className)}
        loading={loading}
        decoding="async"
        sizes={sizes}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
