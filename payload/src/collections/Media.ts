import { CollectionConfig } from "payload/types";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {},
  access: {
    read: (): boolean => true,
    create: () => true,
    update: () => true,
  },
  upload: {
    staticURL: "/media",
    staticDir: "media",
    mimeTypes: ["image/*"],
  },

  fields: [
    {
      name: "alt",
      type: "text",
    },
  ],
};

export default Media;
