const Post = {
  async totalLikes(parent, args, { prisma }, info) {
      const post = await prisma.query.post(
          {
            where: {
              id: parent.id
            }
          },
          "{ id likedBy { id } totalLikes }"
        )

       return post.totalLikes
  },

  // author(parent, args, { prisma }, info) {
  // return prisma.query.users(null, info)
  //   return db.users.find(user => {
  //     if (user.id === parent.author_id) {
  //       return user;
  //     }
  //   });
  // },

  // comments: (parent, args, { db }, info) => {
  //   return db.comments.filter(comment => {
  //     if (comment.post_id === parent.id) {
  //       return comment;
  //     }
  //   });
  // }
};

export { Post as default };
