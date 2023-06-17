import type { Post } from "@/types";

const url = import.meta.env.DEV
  ? "http://payload:3001"
  : `${import.meta.env.PAYLOAD_URL}`;

export const getPosts = async () =>
  (await (await fetch(`${url}/api/posts`)).json()).docs as Post[];

export const getPost = async (id: string) =>
  (await (await fetch(`${url}/api/posts/${id}`)).json()) as Post;

export const getImageSrc = (src: string) => `${url}/media/${src}`;
