import getUserId from '../../src/utils/getUserId'

const Comment = {
  author_id: {
    async resolve(parent, args, { prisma, request }, info) {
      const userId = getUserId(request)

      const user = await prisma.query.user({
          where: { id: userId }
        },
      info)
      return user
    }
  },

  post_id: {
    async resolve(parent, args, { prisma, request }, info ) {
      console.log(parent)
      // console.log(args.id)
      const post = await prisma.query.post({
        where: { id: parent.post_id.id}
      }, info)
      console.log(post)
      return post
    }
  }
};

export { Comment as default };
