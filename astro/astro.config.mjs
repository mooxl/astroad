import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import sitemap from "@astrojs/sitemap";
import prefetch from "@astrojs/prefetch";

export default defineConfig({
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
  experimental: {
    viewTransitions: true,
  },
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    prefetch({
      selector: "a",
    }),
    sitemap(),
  ],
});
