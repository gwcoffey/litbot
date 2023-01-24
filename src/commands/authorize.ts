import yargs from 'yargs'
import * as readline from 'node:readline/promises';
import * as process from 'process';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { MastodonApplication, MastodonToken}  from '../types/mastodon_types';

exports.command = 'authorize <instance>'
exports.description = 'Authorize litbot on your account'
exports.builder = (yargs: yargs.Argv) => {
    yargs.positional('instance', {
        describe: 'the instance url, eg https://botsin.space',
        type: 'string',
        demandOption: true
      })
}
exports.handler = execute

const MASTODON_SCOPE = 'read:statuses read:search write:statuses'
const OAUTH_REDIRECT_URL = 'urn:ietf:wg:oauth:2.0:oob';

async function execute(argv: any) {
    const instance = argv.instance;
    const app = await fetchMakeApp(instance);
    dumpInstructions(argv.instance, app);
    const code = await promptForAuthCode();
    const token = await fetchToken(instance, app, code);
    dumpSecondInstructions(app, code, token);
}

async function promptForAuthCode(): Promise<string> {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const code = await rl.question("Authorization Code: ");
    rl.close();
    return code;
}

function dumpInstructions(instance: string, app: any) {
    console.log("App registration was successful. Now you need to authorize the app to access your account.");
    console.log();
    console.log("To do so, go here:");
    console.log();
    console.log(`   => ${makeAuthUrl(instance, app.client_id)}`);
    console.log();
    console.log("Once you authorize the app, copy the authorization code and paste below.");
    console.log();
}

function dumpSecondInstructions(app: MastodonApplication, auth_code: string, token: MastodonToken) {
    console.log("Authorization was successful. Please keep the following information somewhere safe:");
    console.log();
    console.log(`   client_id: ${app.client_id!}`);
    console.log(`   client_secret: ${app.client_secret!}`);
    console.log(`   authorization code: ${auth_code!}`);
    console.log(`   token: ${token.access_token}`);
    console.log();
}

async function fetchToken(instance: string, app: MastodonApplication, auth_code: string): Promise<MastodonToken> {
    const data = new FormData();
    data.append('grant_type', 'authorization_code');
    data.append('code', auth_code);
    data.append('client_id', app.client_id!);
    data.append('client_secret', app.client_secret!);
    data.append('redirect_uri', OAUTH_REDIRECT_URL);
    data.append('scope', MASTODON_SCOPE);

    try {
        var response = await fetch(makeTokenUrl(instance), {
            method: 'POST',
            body: data
        });
    }
    catch (e: any) {
        console.error(`Error: ${e.message}`);
        process.exit(-1);
    }

    if (!response.ok) {
        console.error(`Error: ${response.statusText}`)
        process.exit(-1)
    }

    return response.json() as Promise<MastodonToken>;
}

async function fetchMakeApp(instance: string): Promise<MastodonApplication> {
    try {
        var response = await fetch(makeAppUrl(instance), {
            method: 'POST',
            body: makeAppBody()
        });
    }
    catch (e: any) {
        console.error(`Error: ${e.message}`);
        process.exit(-1);
    }

    if (!response.ok) {
        console.error(`Error: ${response.statusText}`)
        process.exit(-1)
    }

    return response.json() as Promise<MastodonApplication>;
}

function makeAppUrl(instance: string) {
    const url = new URL(instance);
    url.pathname = '/api/v1/apps';
    return url.toString();
}

function makeTokenUrl(instance: string) {
    const url = new URL(instance);
    url.pathname = '/oauth/token';
    return url.toString();
}

function makeAuthUrl(instance: string, client_id: string) {
    const url = new URL(instance);
    url.pathname = '/oauth/authorize';
    
    const params = new URLSearchParams();
    params.append('client_id', client_id);
    params.append('scope', MASTODON_SCOPE);
    params.append('redirect_uri', OAUTH_REDIRECT_URL);
    params.append('response_type', 'code');
    params.append('force_login', 'true');

    url.search = params.toString();
    return url;
}

function makeAppBody(): FormData {
    var data = new FormData();
    data.append('client_name', 'Litbot');
    data.append('redirect_uris', 'urn:ietf:wg:oauth:2.0:oob');
    data.append('scopes', MASTODON_SCOPE);
    data.append('website', 'https://gwcoffey.com/litbot');
    return data;
}