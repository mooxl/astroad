import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import compress from "astro-compress";

import critters from "astro-critters";

export default defineConfig({
  integrations: [
    tailwind({
      config: { applyBaseStyles: false },
    }),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    compress(),
    critters(),
  ],
});
