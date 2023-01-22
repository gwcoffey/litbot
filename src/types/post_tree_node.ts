import Post from './post'

export default interface PostTreeNode {
    name: string,
    posts?: Post[],
    locations: PostTreeNode[]
}
