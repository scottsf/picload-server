const User = {
  posts(parent, args, { db, prisma }, info) {
    return prisma.query.posts(null, info)


    // return db.posts.filter(post => {
    //   return post.author_id === parent.id;
    // });
  },

  comments(parent, args, { db }, info) {
    return db.comments.filter(comment => {
      if (comment.author_id === parent.id) {
        return comment;
      }
    });
  }
};

export { User as default };
