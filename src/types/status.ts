import {Poll, Visibility} from './mastodon_types'

export default interface Status {
    status: string,
    poll?: Poll
    spoiler_text?: string,
    visibility?: Visibility,
    scheduled_in?: number
}