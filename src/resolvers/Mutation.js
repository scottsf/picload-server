import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'

// Take in password -> Validate password -> Hash password -> Generate auth token
// JSON Web Token (JWT)

const Mutation = {
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({where: {email: args.email}})
    if (!user) throw new Error('Email does not exist')
    const isMatch = await bcrypt.compare(args.password, user.password)

    if (!isMatch) {
      throw new Error('Password is not matching')
    } 

    return {
      user,
      token: jwt.sign({userId: user.id}, 'jwtsecret')
    }
  },

  async createUser(parent, args, { prisma }, info) {
    if (args.data.password.length < 8) {
      throw new Error('Password must be 8 characters or longer')
    }

    const password = await bcrypt.hash(args.data.password, 10)

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    })

    return {
      user,
      token: jwt.sign({userId: user.id}, 'jwtsecret')
    }
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

  async createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return await prisma.mutation.createPost({
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: {
          connect: {id: userId}
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
  },

};

export { Mutation as default };
