import getUserId from "../../utils/getUserId";

const updateComment = async (parent, args, { prisma, request }, info) => {
  const userId = getUserId(request);

  const commentExist = await prisma.exists.Comment({
    id: args.id,
    author_id: {
      id: userId
    }
  });

  if (!commentExist) throw new Error("Unable to update");

  return prisma.mutation.updateComment(
    {
      data: args.data,
      where: {
        id: args.id
      }
    },
    info
  );
};

export { updateComment as default };
