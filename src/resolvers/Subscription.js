const SOMETHING_CHANGED_TOPIC = "something_changed";

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
  }
};

export { Subscription as default };
