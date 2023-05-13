import { buildConfig } from "payload/config";
import path from "path";
import Categories from "./collections/Categories";
import Posts from "./collections/Posts";
import Tags from "./collections/Tags";
import Users from "./collections/Users";

export default buildConfig({
  serverURL: "http://localhost:3001",
  admin: {
    user: Users.slug,
  },
  collections: [Categories, Posts, Tags, Users],
  typescript: {
    outputFile: path.resolve("../", "types.ts"),
  },
});
