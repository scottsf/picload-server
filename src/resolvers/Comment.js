const Comment = {
  author_id(parent, args, { db }, info) {
    return db.users.find(user => user.id === parent.author_id);
  },

  post_id(parent, args, { db }, info) {
    return db.posts.find(post => post.id === parent.post_id);
  }
};

export { Comment as default };
