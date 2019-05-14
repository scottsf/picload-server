import getUserId from '../utils/getUserId'

export const Subscription = {
  comment: {
    subscribe(parent, args, { prisma, pubsub }, info) {
      return prisma.subscription.comment({
        where: {
          node: {
            post_id: {
              id: args.post_id
            }
          }
        }
      }, info)
    }
  },

  post: {
    subscribe(parent, args, { prisma, pubsub }, info) {
      return prisma.subscription.post({
        where: {
          node: {
            published: true
          }
        }  
      }, info)
    }
  }, 

  myPost: {
    subscribe(parent, args, { prisma, request }, info) {
      const userId = getUserId(request)

      return prisma.subscription.post({
        where: {
          node: {
            published: true,
            author: {
              id: userId
            }
          }
        }
      }, info)
    }
  }
};

export { Subscription as default };
