import { extractFragmentReplacements } from "prisma-binding"
import Mutation from "./Mutation";
import Query from "./Query";
import Comment from "./Comment";
import Post from "./Post";
import User from "./User";
import Subscription from './Subscription'

const resolvers = {
    Mutation,
    Query,
    Comment,
    Post,
    User,
    Subscription
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }

