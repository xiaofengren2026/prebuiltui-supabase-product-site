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
};

export function ResponsiveImage({
  src,
  alt,
  className,
  containerClassName,
  fallbackLabel = "图片暂不可用",
}: ResponsiveImageProps) {
  const [hasError, setHasError] = useState(false);

  const showFallback = useMemo(() => !src || hasError, [hasError, src]);

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
        src={src ?? undefined}
        alt={alt}
        className={cn("h-full w-full object-cover", className)}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
