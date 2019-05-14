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

  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    return prisma.mutation.deleteUser({where: {id: userId}})
  },

  updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    
    return prisma.mutation.updateUser({
      where: {
        id: userId
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

  // check user exists because there is no where -> author. Look at :4466, 
  async  deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const postExists = prisma.exists.Post({
      id: args.id, 
      author: {
        id: userId
      }
    })

    if (!postExists) throw new Error('Unable to delete post')

    return await prisma.mutation.deletePost({
      where: {
        id: args.id
      }   
    }, info)
  },

  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const postExist = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    })

    if (!postExist) throw new Error('Unable to update')

    const post = await prisma.query.post({
      where: {
       id: args.id
      }
    })

    if (post.published && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post_id: {
            id: args.id
          }
        }
      })
    }

    return prisma.mutation.updatePost({
      where: {
        id: args.id,
      },
      data: args.data
    }, info)
  },

  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const postPublished = await prisma.exists.Post({
      id: args.data.post_id,
      published: true
    })

    if(!postPublished) throw new Error('Post is not published')

    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author_id: {
          connect: {
            id: userId
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

  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    console.log(userId)

    const commentExist = await prisma.exists.Comment({
      id: args.id,
      author_id: {
        id: userId
      }
    })

    if (!commentExist) throw new Error('Unable to delete')

    return prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    }, info)
  },

  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const commentExist = await prisma.exists.Comment({
      id: args.id,
      author_id: {
        id: userId
      }
    })

    if (!commentExist) throw new Error('Unable to delete')

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
