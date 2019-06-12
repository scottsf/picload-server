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

  likes: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, { prisma, request }, info) {
      const userId = getUserId(request, false);

      if (userId && userId === parent.id) {
        return prisma.query.posts({
          where: {
            likedBy_some: {
              id: userId
            }
          }
        }, info);
      } else {
        return null;
      }
    }
  },
};

export { User as default };
