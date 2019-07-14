import getUserId from "../../utils/getUserId";

const createComment = async (parent, args, { prisma, request }, info) => {
  const userId = getUserId(request);

  const postPublished = await prisma.exists.Post({
    id: args.data.post_id,
    published: true,
    disabled: false
  });

  if (!postPublished) throw new Error("Post is not published or disabled");

  const newComment = await prisma.mutation.createComment({
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

  return newComment
};

export { createComment as default };
