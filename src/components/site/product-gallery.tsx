"use client";

import { useState } from "react";

import { ResponsiveImage } from "@/components/shared/responsive-image";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  name: string;
  images: string[];
};

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const gallery = images.length > 0 ? images : [""];
  const [activeImage, setActiveImage] = useState(gallery[0]);

  return (
    <div className="grid gap-4">
      <div className="section-card overflow-hidden">
        <div className="h-[420px] md:h-[560px]">
          <ResponsiveImage
            src={activeImage}
            alt={name}
            className="h-full w-full object-cover"
            fallbackLabel="产品主图待上传"
            loading="lazy"
            width={1200}
            quality={82}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </div>

      {gallery.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {gallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={cn(
                "section-card overflow-hidden transition",
                activeImage === image ? "ring-2 ring-accent" : "opacity-80 hover:opacity-100",
              )}
              onClick={() => setActiveImage(image)}
            >
              <div className="h-22">
                <ResponsiveImage
                  src={image}
                  alt={`${name} 缩略图 ${index + 1}`}
                  className="h-full w-full object-cover"
                  fallbackLabel="图片"
                  loading="lazy"
                  width={240}
                  quality={72}
                  sizes="25vw"
                />
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
