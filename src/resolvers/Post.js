const Post = {
  author: (parent, args, { db }, info) => {
    return db.users.find(user => {
      if (user.id === parent.author_id) {
        return user;
      }
    });
  },

  comments: (parent, args, { db }, info) => {
    return db.comments.filter(comment => {
      if (comment.post_id === parent.id) {
        return comment;
      }
    });
  }
};

export { Post as default };
