export interface MastodonApplication {
    name: string,
    website?: string,
    vapid_key: string,
    client_id?: string,
    client_secret?: string
}

export interface MastodonToken {
    access_token: string,
    token_type: string,
    scope: string,
    created_at: number
}

export enum Visibility {
    public,
    unlisted,
    private,
    direct
}

export interface Poll {
    options: string[],
    expires_in: number,
    multiple: boolean,
    hide_totals: boolean
}

export interface MastodonStatusPost {
    status: string;
    poll?: Poll;
    sensitive?: boolean;
    spoiler_text?: string;
    visibility?: Visibility;
    scheduled_at?: string;
    in_reply_to_id?: string
}

export interface MastodonStatus {
    id: string;
    uri: string;
}