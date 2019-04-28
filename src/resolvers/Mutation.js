import uuidv4 from "uuid/v4";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const userExist = db.users.some(user => user.email === args.data.email);

    if (userExist) {
      throw new Error("User email exists");
    }

    const user = { ...args.data, id: uuidv4() };
    db.users.push(user);
    return user;
  },

  deleteUser(parent, args, { db }, info) {
    const userIdx = db.users.findIndex(user => user.id === args.id);

    if (userIdx === -1) {
      throw new Error("User does not exists");
    }

    const deletedUser = db.users.splice(userIdx, 1);

    db.posts = db.posts.filter(post => {
      const match = post.author_id === args.id;

      if (match) {
        db.comments = db.comments.filter(
          comment => comment.post_id !== post.id
        );
      }

      return !match;
    });
    db.comments = db.comments.filter(comment => comment.author_id !== args.id);
    return deletedUser[0];
  },

  updateUser(parent, args, { db }, info) {
    let user = db.users.find(user => user.id === args.data.id);

    if (!user) {
      throw new Error("User does not exist");
    }

    if (typeof args.data.name === "string") {
      user.name = args.data.name;
    }

    if (typeof args.data.email === "string") {
      let emailTaken = db.users.some(user => user.email === args.data.email);

      if (emailTaken) {
        throw new Error("User email taken");
      }

      user.email = args.data.email;
    }

    if (typeof args.data.password === "string") {
      user.password = args.data.password;
    }

    return user;
  },

  createPost(parent, args, { db, pubsub }, info) {
    const userExist = db.users.some(user => user.id === args.data.author_id);

    if (!userExist) {
      throw new Error("User does not exist");
    }

    const post = { id: uuidv4(), ...args.data };
    db.posts.push(post);

    if (args.data.published === true) {
        pubsub.publish(`new post ${args.data.author_id}`, {createNewPost: post})
    }
    
    return post;
  },

  deletePost(parent, args, { db }, info) {
    const postIdx = db.posts.findIndex(post => post.id === args.id);

    if (postIdx === -1) {
      throw new Error("Post does not exist");
    }

    const deletedPost = db.posts.splice(postIdx, 1);
    db.comments = db.comments.filter(comment => comment.post_id !== args.id);
    return deletedPost[0];
  },

  updatePost(parent, args, { db }, info) {
    const post = db.posts.find(post => post.id === args.data.id);

    if (!post) {
      throw new Error("Post does not exist");
    }

    if (typeof args.data.title === "string") {
      post.title = args.data.title;
    }

    if (typeof args.data.body === "string") {
      post.body = args.data.body;
    }

    if (typeof args.data.published) {
      post.published = args.data.published;
    }

    return post;
  },

  createComment(parent, args, { db, pubsub }, info) {
    const postExist = db.posts.some(post => post.id === args.data.post_id);
    const userExist = db.users.some(user => user.id === args.data.author_id);

    if (!postExist || !userExist) {
      throw new Error("User or post does not exist");
    }

    const comment = { id: uuidv4(), ...args.data };
    db.comments.push(comment);

    pubsub.publish(`new comment ${args.data.post_id}`, {createNewComment: comment})
    return comment;
  },

  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(
      comment => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error("Comment does not exist");
    }

    const deletedComment = db.comments.splice(commentIndex, 1);
    return deletedComment[0];
  },

  updateComment(parent, args, { db }, info) {
    const comment = db.comments.find(comment => comment.id === args.data.id);

    if (!comment) {
      throw new Error("Comment does not exist");
    }

    if (typeof args.data.text === "string") {
      comment.text = args.data.text;
    }

    return comment
  }
};

export { Mutation as default };
