import Post from '../types/post'
import PostTreeNode from '../types/post_tree_node'

export default function buildPostTree(posts: Post[]): PostTreeNode[] {
    var result: PostTreeNode[] = []
    posts.forEach((post) => {
        var current_container = result
        var current_node: PostTreeNode | null = null
        post.location.forEach((location) => {
            const existing = current_container.find((loc) => loc.name == location)
            if (existing) {
                current_node = existing
                current_container = current_node.locations
            }
            else {
                current_node = { name: location, locations: [] }
                current_container.push(current_node)
            }
        })
        if (current_node != null) {
            const node = current_node as PostTreeNode
            node.posts ||= []
            node.posts.push(post)
        }
    })
    return result
}
