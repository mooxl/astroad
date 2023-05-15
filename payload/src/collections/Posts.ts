import { CollectionConfig } from "payload/types";

const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    defaultColumns: ["title", "author", "status"],
    useAsTitle: "title",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
    },
    {
      name: "publishedDate",
      type: "date",
    },

    {
      name: "content",
      type: "richText",
      admin: {
        upload: {
          collections: {
            media: {
              fields: [
                {
                  name: "imagel",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                },
              ],
            },
          },
        },
      },
    },
    {
      name: "status",
      type: "select",
      options: [
        {
          value: "draft",
          label: "Draft",
        },
        {
          value: "published",
          label: "Published",
        },
      ],
      defaultValue: "draft",
      admin: {
        position: "sidebar",
      },
    },
  ],
};

export default Posts;
