import getUserId from "../../utils/getUserId";

const createPost = async (parent, args, { prisma, request }, info) => {
  const userId = getUserId(request);

  return await prisma.mutation.createPost(
    {
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: {
          connect: { id: userId }
        }
      }
    },
    info
  );
};

export { createPost as default };
