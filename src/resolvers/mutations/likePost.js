import getUserId from "../../utils/getUserId";

const likePost = async (parent, args, { prisma, request }, info) => {
  const userId = getUserId(request);
  const userExist = await prisma.exists.User({ id: userId });
  if (!userExist) throw new Error("User does not exists");
  if (!args.id) throw "Post does not exists";

  if (args.like) {
    return prisma.mutation.updatePost(
      {
        where: {
          id: args.id
        },
        data: {
          likedBy: {
            connect: [
              {
                id: userId
              }
            ]
          }
        }
      },
      info
    );
  } else {
    return prisma.mutation.updatePost(
      {
        where: {
          id: args.id
        },
        data: {
          likedBy: {
            disconnect: [
              {
                id: userId
              }
            ]
          }
        }
      },
      info
    )
  }
};

export { likePost as default };
