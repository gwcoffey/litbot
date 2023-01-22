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

It should be a JSON array of `Post` objects. Each `post` has these properties:

* `text` (`string`, required): The Mastodon post text
* `location` (`array` of `string`, required): Metadata about where the passage comes from
* `content_warning` (`string`, optional): The content warning text, if applicable to this post

> Note: The location is not currently used for anything, but I have aspirations to add support for posting the source information for the passage as a reply some day.

Here's an example of valid post data:

```json
[
   {
      "text": "To be, or not to be, that is the question.",
      "location": ["Hamlet", "Act 3", "Scene 1"]
   },
   {
      "text": "Ram thou thy fruitful tidings in mine ears,\nThat long time have been barren.",
      "location": ["Antony and Cleopatra", "Act 2", "Scene 5"],
      "content_warning": "Bawdy"
   }
]
```

### Validating your post data

You can validate your post data against the schema to ensure it is correct:

```sh
$ npx litbot validate my/post_data.json
```

This will report `OK` if the file is correct, or output schema violations.

### Inspecting your post data

You can also insepct your post data file. You can get a total post count:

```sh
$ npx litbot inspect my/post_data.json count
Loaded 1531 posts…
```

Or count by location hierarchy:

```sh
$ npx litbot inspect my/post_data.json locations
Hamlet
  Act 1
    Scene 1
      => 11 posts
    Scene 2
      => 2 posts
...
```

Or dump the post data to a markdown file for easier review:

```sh
$ npx litbot inspect my/post_data.json markdown
# Hamlet
## Act 1
### Scene 1

Long live the King!
***
Horatio says ’tis but our fantasy
***
...
```

## Posting to Mastodon

When the bot runs, it will select one post from your post data file at random and post it. There are two ways to invoke the bot, via the CLI or from a script.

### Posting via the CLI

```sh
$ npx litbot post my/post_data.json https://myinstance.example.com xxx
```
(Where `xxx` is the authorization token you got in [the Authorization step above](./#Authorization).)

### Posting via a script

The npm module exports a function: `post(data, instance_url, token)`. Here's an example in TypeScript:

```typescript
import post from "@gwcoffey/litbot"
import post_data from "./posts.json";

const my_token = getStoredSecretToken();
post(post_data, new URL('https://myinstance.example.com'), my_token);
```

The `post` function will throw an `Error` if posting fails.
