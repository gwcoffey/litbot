import yargs from 'yargs'
import postRandomToMastodon from '../lib/poster'
import loadPostDataFromFile from '../lib/posts_loader'

exports.command = 'post <file> <instance> <token>'
exports.description = 'Post to mastodon'
exports.builder = (yargs: yargs.Argv) => {
    yargs.positional('file', {
        describe: 'the post data file',
        type: 'string',
        demandOption: true
    })
    yargs.positional('instance', {
        describe: 'the instance url, eg https://botsin.space',
        type: 'string',
        demandOption: true
    })
    yargs.positional('token', {
        describe: 'the authorization bearer token',
        type: 'string',
        demandOption: true
    })
}
exports.handler = execute


async function execute(argv: any) {
    try {
        const posts = await loadPostDataFromFile(argv.file);
        await postRandomToMastodon(posts, argv.instance, argv.auth);
        console.log('DONE');
    }
    catch (e: any) {
        console.error(`Error: ${e.message}`);
        process.exit(-1);
    }
}