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

export default interface Status {
    status: string,
    poll?: Poll
    spoiler_text?: string,
    visibility?: Visibility,
    scheduled_at?: number
}