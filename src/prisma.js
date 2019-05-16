import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers/index'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: 'mysecret',
    fragmentReplacements
})

export {prisma as default}


// prisma.query.users(null, '{id name comments {id text}}')
//     .then(res => console.log(JSON.stringify(res, null, 2)))

// const posts = async () => {
//     return await prisma.query.posts(null, '{id title body}')
// }

// console.log(posts().then(res => console.log(res)))
