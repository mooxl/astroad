import { buildConfig } from "payload/config";
import path from "path";
import Posts from "./collections/Posts";
import Users from "./collections/Users";
import Media from "./collections/Media";

export default buildConfig({
  serverURL: "http://localhost:3001",
  admin: {
    user: Users.slug,
  },
  collections: [Posts, Users, Media],
  typescript: {
    outputFile: path.resolve("/", "types.ts"),
  },
});
