import postRandomToMastodon from "./lib/poster";
import Thread from "./types/thread";

export default async function post(threads: Thread[], instance: URL, auth: string) {
    await postRandomToMastodon(threads, instance, auth);
}