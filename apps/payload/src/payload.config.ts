import path from "path";

import { webpackBundler } from "@payloadcms/bundler-webpack";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload/config";

import { Posts } from "./collections/Posts";
import { Users } from "./collections/Users";

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  serverURL: process.env.PAYLOAD_URL,
  editor: lexicalEditor({}),
  collections: [Users, Posts],
  typescript: {
    outputFile: path.resolve(__dirname, "types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@localhost:5432/payload`,
    },
  }),
});
