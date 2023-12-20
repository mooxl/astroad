import type { Post } from "payload";

export const getPosts = async () =>
  (await (await fetch(
    `${import.meta.env.PAYLOAD_URL}/api/posts`,
  )).json()).docs as Post[];
