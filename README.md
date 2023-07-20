# litbot

An NPM module for posting periodic passages to mastodon.

You can find the published module here: https://www.npmjs.com/package/@gwcoffey/litbot

At a high level you:
1. Authorize the bot.
2. Provide a file full of possible posts.
3. And the bot will select one post at random and post it to Mastodon.

You can run the bot periodically and it will select a new random post each time.

## Installation

```sh
$ npm i @gwcoffey/litbot
```

## Authorization

Before you can post to Mastodon you need to authorize the bot and get an auth token.

```sh
$ npx litbot authorize https://myinstance.example.com
```

This will walk you through the process of registering the app with the instance, granting post access to the account, and fetching a token.

## Post Data File

The module expects a data file with available post messages. The post data format is defined in [this schema][schema].

[schema]: https://github.com/gwcoffey/litbot/blob/main/src/schema/posts.schema.json

It should be a JSON array of arrays of `Status` objects. Each array of statuses represents a thread of status messages to post all at once (although some can be scheduled). Each `status` matches the shape of [the `Status` message in Mastodon API](https://docs.joinmastodon.org/methods/statuses/#form-data-parameters) with these suported properties:

* `post` (`string`, required): The Mastodon post status text
* `poll` (`object`, required): The poll settings for this status post
* `spoiler_text` (`string`, optional): The content warning text, if applicable to this post (when set, the post will be marked `sensitive` as well)
* `visibility` (`string`, optional): The visibility setting for this status post
* `scheduled_in` (`integer`, optional): When set, at the time of posting, litbot will calculate a timestamp <n> seconds in the future and set the `scheduled_at` property of the status to this timestamp)

Here's an example of valid post data, including various allowed combinations.

```json
[
  [
    {
      "status": "To be, or not to be, that is the question."
    },
    {
      "status": "Ram thou thy fruitful tidings in mine ears,\nThat long time have been barren.",
      "spoiler_text": "Bawdy"
    },
    {
      "status": "Wherefor art thou, Romeo?",
      "poll": {
        "options": ["Because my mother named me that", "Because I was meant to be"],
        "expires_in": 300
      }
    },
    {
      "status": "To be or not to be, that is the question.",
      "visibility": "private"
    },
    {
      "status": "Tomorrow, and tomorrow, and tomorrow,\nCreeps in this petty pace from day to day,",
      "scheduled_in": 86400
    }
  ]
]
```

### Validating your post data

You can validate your post data against the schema to ensure it is correct:

```sh
$ npx litbot validate my/post_data.json
```

This will report `OK` if the file is correct, or output schema violations.

## Posting to Mastodon

When the bot runs, it will select one post from your post data file at random and post it. There are two ways to invoke the bot, via the CLI or from a script.

### Posting via the CLI

```sh
$ npx litbot post my/post_data.json https://myinstance.example.com xxx
```
(Where `xxx` is the authorization token you got in [the Authorization step above](#Authorization).)

### Posting via a script

The npm module exports a function: `post(data, instance_url, token)`. Here's an example in TypeScript:

```typescript
import post from "@gwcoffey/litbot"
import post_data from "./posts.json";

const my_token = getStoredSecretToken();
post(post_data, new URL('https://myinstance.example.com'), my_token);
```

The `post` function will throw an `Error` if posting fails.
