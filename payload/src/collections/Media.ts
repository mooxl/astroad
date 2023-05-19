import { CollectionConfig } from "payload/types";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Bild",
    plural: "Bilder",
  },
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
  fields: [],
};

export default Media;
