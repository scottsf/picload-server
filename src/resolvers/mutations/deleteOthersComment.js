import getUserId from "../../utils/getUserId";

const deleteOthersComment = async (parent, args, { prisma, request }, info) => {
  const userId = getUserId(request);

  const postId = await prisma.query.comments(
    {
        where: {
          id: args.id
        }
      },
      '{ post_id { id } }'
  );

  if (postId.length === 0) throw new Error('Unable to delete comment')

  const commentExist = await prisma.exists.Comment(
    {
      author_id: {
        id: userId
      },
      post_id: {
        id: postId[0].post_id.id
      }
    },
  );

  if (!commentExist) throw new Error("Unable to delete comment");

  return prisma.mutation.deleteComment(
    {
      where: {
        id: args.id
      }
    },
    info
  );
};

export { deleteOthersComment as default };
