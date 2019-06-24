import getUserId from "../../utils/getUserId";

const likePost = async (parent, args, { prisma, request }, info) => {
  const userId = getUserId(request);
  const userExist = await prisma.exists.User({ id: userId });
  if (!userExist) throw new Error("User does not exists");
  if (!args.id) throw "Post does not exists";

  const post = await prisma.query.post({
    where: {
      id: args.id
    }
  }, info);

  const userLikedPost = post.likedBy.some(user => user.id === userId)

  if (userLikedPost && args.like === true) throw Error('User already liked the post')

  let totalLikes = post.totalLikes;

  if (args.like) {
    totalLikes++;

    return await prisma.mutation.updatePost(
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
          },
          totalLikes
        }
      },
      info
    );

  } else {
    totalLikes--;    
    
    return await prisma.mutation.updatePost(
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
          },
          totalLikes
        }
      },
      info
    );
  }
};

export { likePost as default };
