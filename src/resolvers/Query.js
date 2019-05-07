const Query = {
  users(parent, args, { prisma }, info) {   // not method
    const opArgs = {
      where: {
        name_contains: args.query
      }
    }

    if (!args.query) {
      return prisma.query.users()
    }

    return  prisma.query.users(opArgs, info)
  },

  posts(parent, args, { prisma }, info) {
    if (!args.query) {
      return prisma.query.posts(null, info);
    }

    const opArgs = {
      where: {
        title_contains: args.query
      }
    }

    return prisma.query.posts(opArgs, info)

  },

  comments(parent, args, { prisma }, info) {
    if (!args.query) {
      return prisma.query.comments(null, info);
    }
  }
};

export { Query as default };
