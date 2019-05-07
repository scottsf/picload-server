import uuidv4 from "uuid/v4";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    return await prisma.mutation.createUser({data: args.data})
  },

  async deleteUser(parent, args, { prisma }, info) {
    return prisma.mutation.deleteUser({where: {id: args.id}})
  },

  updateUser(parent, args, { prisma }, info) {
    return prisma.mutation.updateUser({
      where: {
        id: args.id
      }, 
      data: args.data
    }, info)
  },

  async createPost(parent, args, { prisma, pubsub }, info) {
    return await prisma.mutation.createPost({
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: {
          connect: {id: args.data.author_id}
        }}}, info)
  },

  deletePost(parent, args, { prisma, pubsub }, info) {
    return prisma.mutation.deletePost({
      where: {
        id: args.id
      }   
    }, info)
  },

  updatePost(parent, args, { prisma, pubsub }, info) {
    return prisma.mutation.updatePost({
      where: {
        id: args.id,
      },
      data: args.data
    }, info)
  },

  createComment(parent, args, { prisma, pubsub }, info) {
    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author_id: {
          connect: {
            id: args.data.author_id
          }
        },
        post_id: {
          connect: {
            id: args.data.post_id
          }
        }
      }
    })
  },

  deleteComment(parent, args, { prisma, pubsub }, info) {
    return prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    }, info)
  },

  updateComment(parent, args, { prisma, pubsub }, info) {
    return prisma.mutation.updateComment({
      data: args.data,
      where: {
        id: args.id
      }
    }, info)

  //   const comment = db.comments.find(comment => comment.id === args.data.id);
    
  //   if (!comment) {
  //     throw new Error("Comment does not exist");
  //   }

  //   if (typeof args.data.text === "string") {
  //     comment.text = args.data.text;
  //   }

  //   pubsub.publish(`comment channel ${comment.post_id}`, 
  //   {comment: {
  //       mutation: 'UPDATED',
  //       data: comment
  //     }
  //   })

  //   return comment
  // }
  }
};

export { Mutation as default };
