export interface MastodonApplication {
    name: string,
    website?: string,
    vapid_key: string,
    client_id?: string,
    client_secret?: string
}

export interface MastodonStatus {
    status: string;
    sensitive?: boolean;
    spoiler_text?: string;
}

export interface MastodonToken {
    access_token: string,
    token_type: string,
    scope: string,
    created_at: number
}