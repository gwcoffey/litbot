import Post from '../types/post'
import { MastodonStatus } from '../types/mastodon_types'
import loadPostDataFromFile from './posts_loader';

export default async function postRandomToMastodon(posts: Post[], instance: URL, auth: string) {
    const post = selectRandomPost(posts);
    const response = await httpPost(post, instance, auth);
    if (!response.ok) {
        const errorMsg = await response.text();
        throw Error(errorMsg)
    }
}

function selectRandomPost(posts: Post[]): Post {
    return posts[Math.floor(Math.random() * posts.length)];
}

async function httpPost(post: Post, instance: URL, auth: string) {
    return await fetch(makeUrl(instance), {
        method: 'POST',
        body: JSON.stringify(makeStatusBody(post)),
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${auth}` }
    });
}

function makeUrl(instance: URL): URL {
    const url = new URL(instance);
    url.pathname = '/api/v1/statuses';
    return url;
}

function makeStatusBody(post: Post) {
    const body: MastodonStatus = { status: post.text };
    if (post.content_warning) {
        body.sensitive = true;
        body.spoiler_text = post.content_warning;
    }
    return body;
}
