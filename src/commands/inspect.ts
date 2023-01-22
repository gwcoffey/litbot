import yargs, { exit } from 'yargs'
import Post from "../types/post"
import loadPostDataFromFile from '../lib/posts_loader'
import buildPostTree from '../lib/post_tree_builder'
import PostTreeNode from '../types/post_tree_node'

exports.command = 'inspect <file> [output]'
exports.description = 'Examine the post data file'
exports.builder = (yargs: yargs.Argv) => {
    yargs.positional('file', {
        describe: 'the post data file',
        type: 'string',
        demandOption: true
      })
    yargs.positional('output', {
        describe: 'what info should be displayed',
        type: 'string',
        choices: ['count', 'locations', 'markdown'],
        default: 'count'
    })
}
exports.handler = execute


async function execute(argv: any) {
    const posts: Post[] = await loadPostDataFromFile(argv.file)
    const tree = buildPostTree(posts)

    switch(argv.output) {
        case 'count':
            console.log(`Loaded ${posts.length} posts…`)
            break
        case 'locations':
            console.log(buildLocationList(tree))
            break
        case 'markdown':
            console.log(buildMarkdown(tree))
            break
    }
}

function buildLocationList(tree: PostTreeNode[]): string {
    var output: string[] = []
    tree.forEach((node) => locationListForNode(node, 0, output))
    return output.join("\n")
}

function locationListForNode(node: PostTreeNode, depth: number, output: string[]) {
    const prefix = '  '.repeat(depth)
    output.push(`${prefix}${node.name}`)
    if ('posts' in node) {
        output.push(`${prefix}  => ${node.posts?.length} posts`)
    }
    node.locations.forEach((child) => locationListForNode(child, depth+1, output))
}

function buildMarkdown(tree: PostTreeNode[]): string {
    var output: string[] = []
    tree.forEach((node) => markdownForNode(node, 0, output))
    return output.join("\n\n")
}

function markdownForNode(node: PostTreeNode, depth: number, output: string[]) {
    output.push(`${'#'.repeat(depth+1)} ${node.name}`)
    node.locations.forEach((child) => markdownForNode(child, depth+1, output))

    node.posts?.forEach((post, idx) => {
        var post_text = post.text
        if (post.content_warning) {
            post_text = `Content Warning: ${post.content_warning}\n` + post_text
        }
        output.push(post_text)
        if (node.posts && idx < node.posts?.length || 0) {
            output.push("***")
        }
    })
}
