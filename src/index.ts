import postRandomToMastodon from "./lib/poster";
import loadPostDataFromFile from "./lib/posts_loader";

export default async function loadAndPost(file: string, instance: URL, auth: string) {
    const posts = await loadPostDataFromFile(file);
    postRandomToMastodon(posts, instance, auth);
}