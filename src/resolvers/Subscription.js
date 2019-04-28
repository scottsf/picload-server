import { userInfo } from "os";

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

  createNewComment: {
    subscribe(parent, args, { pubsub, db }, info) {
        const post = db.posts.find(post => {
           return post.id === args.post_id && post.published 
        })

        if (!post) {
            throw new Error('Post does not exist')
        }

        return pubsub.asyncIterator(`new comment ${post.id}`)
    }
  },

  createNewPost: {
      subscribe(parent, args, {db, pubsub}, info) {
          const user = db.users.find(user => {
             return user.id === args.user_id
          })

          if (!user) {
              throw new Error('User does not exist')
          }

          console.log(args.user_id)
         return pubsub.asyncIterator(`new post ${args.user_id}`)
      }
  }
};

export { Subscription as default };
