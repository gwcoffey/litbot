import yargs from 'yargs'
import { loadJson } from "../lib/posts_loader"
import { validatePostJson } from "../lib/posts_validator"

exports.command = 'validate <file>'
exports.description = 'Validate a posts data file'
exports.builder = (yargs: yargs.Argv) => {
    yargs.positional('file', {
        describe: 'the post data file to validate',
        type: 'string',
        demandOption: true
      })
}
exports.handler = execute


async function execute(argv: any) {
    var data;
    try {
        data = await loadJson(argv.file)
    }
    catch(e: any) {
        console.error("Error: " + e.message)
        process.exit(-1)
    }

    const result = validatePostJson(data)

    if (result.ok) {
        console.log("OK")
    }
    else {
        console.error("Error: post data does not match schema")
        console.error(result.errors?.join("\n"))
    }
}