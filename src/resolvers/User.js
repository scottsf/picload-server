import getUserId from "../utils/getUserId";

const User = {
  email: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, { prisma, request }, info) {
      const userId = getUserId(request, false);

      if (userId && userId === parent.id) {
        return parent.email;
      } else {
        return null;
      }
    }
  },

  password(parent, args, ctx, info) {
    return "Password is protected";
  },

  posts: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, { prisma, request }, info) {
      const opArgs = {
        where: {
          published: true,
          author: {
            id: parent.id
          }
        }
      };

      return prisma.query.posts(opArgs);
    }
  },

  // posts(parent, args, { prisma, request }, info) {
  //   const userId = getUserId(request)

  //   const opArgs = {
  //     where: {
  //       published: true
  //     }
  //   }

  //   return prisma.query.posts(opArgs, info)
  // },

  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },

  // likes(parent, args, { prisma, request }, info) {
  //   const userId = getUserId(request);

  //   return prisma.query.posts({
  //     AND: [
  //       {
  //         where: {
  //           likedBy_every: {
  //             id: userId
  //           }
  //         }
  //       }

  //     ]

  //     // where: {
  //     //   likedPosts_every: {
  //     //     likedBy_every: {
  //     //       id: userId
  //     //     }
  //     //   }
  //     // }
  //   });
  //   // console.log(data)
  // }
};

export { User as default };
