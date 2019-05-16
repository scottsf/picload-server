import getUserId from "../../utils/getUserId";

// check user exists because there is no where -> author. Look at :4466,
const deletePost = async (parent, args, { prisma, request }, info) => {
  const userId = getUserId(request);

  const postExists = prisma.exists.Post({
    id: args.id,
    author: {
      id: userId
    }
  });

  if (!postExists) throw new Error("Unable to delete post");

  return await prisma.mutation.deletePost(
    {
      where: {
        id: args.id
      }
    },
    info
  );
};

export { deletePost as default };
