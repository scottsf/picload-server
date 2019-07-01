import getUserId from '../utils/getUserId'

const Query = {
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request, true)
    console.log(userId)

    return prisma.query.user({
      where: {
        id: userId
      }
    })
  },

  users(parent, args, { prisma, request }, info) {   // not method
    const opArgs = {
      where: {
        name_contains: args.query
      },
      first: args.first,
      skip: args.skip,
      orderBy: args.orderBy 
    }

    if (!args.query) {
      return prisma.query.users(null, info)
    }

    return  prisma.query.users(opArgs, info)
  },

  posts(parent, args, { prisma }, info) {
    const opArgs = {
      where: {
        published: true
      },
      first: args.first,
      skip: args.skip,
      orderBy: args.orderBy 
    }
  
    if (args.query) {
      opArgs.where.AND = [{
        title_contains: args.query
      }] 
    };

    return prisma.query.posts(opArgs, info)
  },

  myPosts(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const opArgs = {
      where: {
        author: {
          id: userId
        },
        OR: [{
          title_contains: args.query
        }, {
          body_contains: args.query
        }]
      }
    }
    return prisma.query.posts(opArgs, info)

  },

  async post(parent, args, { prisma, request }, info) {
    const userId = getUserId(request, false)

    const posts =  await prisma.query.posts({
      where: {
        id: args.id,
        OR: [{
          published: true
        }, {
          author: {
            id: userId
          }
        }]
      }
    }, info)

    if (posts.length === 0) {
      throw new Error('Post not found')
    }

    return posts[0]
  },

  comments(parent, args, { prisma }, info) {
    const opArgs = {
      where: {
        post_id: {
          id: args.post_id
        }
      },
      first: args.first,
      skip: args.skip,
      orderBy: args.orderBy 
    }
    
    if (!args.query) {
      return prisma.query.comments(opArgs, info);
    }
  },

  async comment(parent, { id }, { prisma }, info) {
    return prisma.query.comment({ 
      where: {
        id
      }
    }, info) 

  }
};

export { Query as default };
