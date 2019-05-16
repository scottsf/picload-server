import getUserId from "../../utils/getUserId";

const createComment = async (parent, args, { prisma, request }, info) => {
  const userId = getUserId(request);

  const postPublished = await prisma.exists.Post({
    id: args.data.post_id,
    published: true
  });

  if (!postPublished) throw new Error("Post is not published");

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
  });
};

export { createComment as default };
