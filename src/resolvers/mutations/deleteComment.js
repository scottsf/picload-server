import getUserId from "../../utils/getUserId";

const deleteComment = async (parent, args, { prisma, request }, info) => {
  const userId = getUserId(request);

  const commentExist = await prisma.exists.Comment({
    id: args.id,
    author_id: {
      id: userId
    }
  });

  if (!commentExist) throw new Error("Unable to delete");

  return prisma.mutation.deleteComment(
    {
      where: {
        id: args.id
      }
    },
    info
  );
};

export { deleteComment as default };
