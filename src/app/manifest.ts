import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "青岚东方",
    short_name: "青岚东方",
    description: "东方美学饰品展示网站",
    start_url: "/",
    display: "standalone",
    background_color: "#dfe8e1",
    theme_color: "#dfe8e1",
    icons: [
      {
        src: "/icon?size=192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon?size=512",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
