import {MastodonStatus, MastodonStatusPost} from '../types/mastodon_types'
import fetch from 'node-fetch';
import Thread from "../types/thread";
import Status from "../types/status";

export default async function postRandomToMastodon(threads: Thread[], instance: URL, auth: string) {
    const thread = selectRandomThread(threads);
    let previous_id: string | null = "";
    for (let post of thread) {
        const response = await httpPost(post, previous_id, instance, auth);

        if (!response.ok) {
            const errorMsg = await response.text();
            throw Error(errorMsg)
        }

        const stat = await response.json() as MastodonStatus;
        previous_id = stat.id;
    }
}

function selectRandomThread(threads: Thread[]): Thread {
    return threads[Math.floor(Math.random() * threads.length)];
}

async function httpPost(status: Status, reply_to_id: string | null, instance: URL, auth: string) {
    return await fetch(makeUrl(instance), {
        method: 'POST',
        body: JSON.stringify(makeStatusBody(status, reply_to_id)),
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${auth}` }
    });
}

function makeUrl(instance: URL): string {
    const url = new URL(instance);
    url.pathname = '/api/v1/statuses';
    return url.toString();
}

function makeStatusBody(status: Status, reply_to_id: string | null) {
    const body: MastodonStatusPost = { status: status.status };
    if (status.poll) {
        body.poll = status.poll;
    }
    if (status.spoiler_text) {
        body.sensitive = true;
        body.spoiler_text = status.spoiler_text;
    }
    if (status.visibility) {
        body.visibility = status.visibility;
    }
    if (status.scheduled_in) {
        body.scheduled_at = new Date(new Date().getTime() + (status.scheduled_in * 1000)).toISOString();
    }
    if (reply_to_id !== null) {
        body.in_reply_to_id = reply_to_id;
    }
    return body;
}
