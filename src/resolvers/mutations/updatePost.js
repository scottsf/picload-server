import getUserId from "../../utils/getUserId";

const updatePost = async (parent, args, { prisma, request }, info) => {
  const userId = getUserId(request);

  const postExist = await prisma.exists.Post({
    id: args.id,
    author: {
      id: userId
    }
  });

  if (!postExist) throw new Error("Unable to update");

  const post = await prisma.query.post({
    where: {
      id: args.id
    }
  });

  console.log("Here :", post)

  if (post.published && args.data.published === false) {
    await prisma.mutation.deleteManyComments({
      where: {
        post_id: {
          id: args.id
        }
      }
    });
  }

  return prisma.mutation.updatePost(
    {
      where: {
        id: args.id
      },
      data: args.data
    },
    info
  );
};

export { updatePost as default };
