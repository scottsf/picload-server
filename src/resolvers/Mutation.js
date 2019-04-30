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
        pubsub.publish(`post channel`, 
        {post: {
          mutation: 'CREATED',
          data: post
        }})
    }

    return post;
  },

  deletePost(parent, args, { db, pubsub }, info) {
    const postIdx = db.posts.findIndex(post => post.id === args.id);

    if (postIdx === -1) {
      throw new Error("Post does not exist");
    }

    const deletedPost = db.posts.splice(postIdx, 1);
    db.comments = db.comments.filter(comment => comment.post_id !== args.id);

    pubsub.publish(`post channel`, 
      {post: {
        mutation: 'DELETED',
        data: deletedPost[0]
      }
    })

    return deletedPost[0];
  },

  updatePost(parent, args, { db, pubsub }, info) {
    const post = db.posts.find(post => post.id === args.data.id);
    const originalPost = {...post}

    if (!post) {
      throw new Error("Post does not exist");
    }

    if (typeof args.data.title === "string") {
      post.title = args.data.title;
    }

    if (typeof args.data.body === "string") {
      post.body = args.data.body;
    }

    if (typeof args.data.published === "boolean") {
      post.published = args.data.published;
    }

    if (originalPost.published && !post.published) {
      // deleted
      pubsub.publish(`post channel`, 
        {post: {
          mutation: 'DELETED',
          data: originalPost
        }})
    } else if (originalPost.published && post.published) {
      // updated
      pubsub.publish(`post channel`, 
      {post: {
        mutation: 'UPDATED',
        data: post
      }})
    } else {
      // created
      pubsub.publish(`post channel`, 
      {post: {
        mutation: 'CREATED',
        data: post
      }})
    }
    
    // // publish changes
    // const wasDeleted = origPost.published && !post.published
    // const wasCreated = !origPost.published && post.published
    // if (wasDeleted || wasCreated || post.published) {
    //   pubsub.publish('post', {
    //     post: {
    //       mutation: (
    //         wasDeleted ? 'DELETED'
    //         : wasCreated ? 'CREATED'
    //         : 'UPDATED'
    //       ),
    //       data: wasDeleted ? origPost : post,
    //     }
    //   })
    // }

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

    pubsub.publish(`comment channel ${args.data.post_id}`, 
      {
        comment: {
          mutation: 'CREATED',
          data: comment
        }
        
      })

    return comment;
  },

  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      comment => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error("Comment does not exist");
    }

    const deletedComment = db.comments.splice(commentIndex, 1);
    console.log(deletedComment[0])

    pubsub.publish(`comment channel ${deletedComment[0].post_id}`, 
      {comment: {
          mutation: 'DELETED',
          data: deletedComment[0]
        }
      })

    return deletedComment[0];
  },

  updateComment(parent, args, { db, pubsub }, info) {
    const comment = db.comments.find(comment => comment.id === args.data.id);
    
    if (!comment) {
      throw new Error("Comment does not exist");
    }

    if (typeof args.data.text === "string") {
      comment.text = args.data.text;
    }

    pubsub.publish(`comment channel ${comment.post_id}`, 
    {comment: {
        mutation: 'UPDATED',
        data: comment
      }
    })

    return comment
  }
};

export { Mutation as default };
