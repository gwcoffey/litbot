import postRandomToMastodon from "./lib/poster";
import Post from "./types/post";

export default async function post(posts: Post[], instance: URL, auth: string) {
    await postRandomToMastodon(posts, instance, auth);
}