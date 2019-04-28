const Query = {
  users(parent, args, { db }, info) {   // not method
    return db.users;
  },

  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }
  },

  comments(parent, args, { db }, info) {
    if (!args.query) {
      return db.comments;
    }
  }
};

export { Query as default };
