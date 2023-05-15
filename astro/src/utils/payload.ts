import type { Post } from "../types";

export const getPosts = async () =>
  (await (await fetch("http://payload:3001/api/posts")).json()).docs as Post[];

export const getPost = async (id: string) =>
  (await (await fetch(`http://payload:3001/api/posts/${id}`)).json()) as Post;
