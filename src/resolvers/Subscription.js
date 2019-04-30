const SOMETHING_CHANGED_TOPIC = "something_changed";

export const Subscription = {
  somethingChanged: {
    subscribe: (parent, args, { pubsub }, info) => {
      let n = 1;

      setInterval(() => {
        n++;
        pubsub.publish(SOMETHING_CHANGED_TOPIC, {
          somethingChanged: { id: n }
        });
      }, 1000);

      return pubsub.asyncIterator(SOMETHING_CHANGED_TOPIC);
    }
  },

  comment: {
    subscribe(parent, args, { db, pubsub }, info) {
      const post = db.posts.find(post => {
        return post.id === args.post_id && post.published;
      });

      if (!post) {
        throw new Error("Post does not published");
      }

      console.log(post.id)

      return pubsub.asyncIterator(`comment channel ${post.id}`);
    }
  },

  post: {
    subscribe(parent, args, { db, pubsub }, info) {
      return pubsub.asyncIterator(`post channel`);
    }
  }
};

export { Subscription as default };
