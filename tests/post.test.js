import "@babel/polyfill";
import "cross-fetch/polyfill";
import seedDatabase, { userOne, postOne, postTwo } from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import prisma from "../src/prisma";
import {
  getPosts,
  myPosts,
  updatePost,
  createPost,
  deletePost,
  subscribeToPosts
} from "./utils/operations";

const client = getClient();
beforeEach(seedDatabase);

test("Should expose public posts", async () => {
  const posts = await client.query({ query: getPosts });
  expect(posts.data.posts.length).toBe(1);
  expect(posts.data.posts[0].title).toBe("Matt title 1");
  expect(posts.data.posts[0].body).toBe("Matt body 1");
  expect(posts.data.posts[0].published).toBe(true);
});

test("Should fetch user posts", async () => {
  const client = getClient(userOne.jwt);
  const { data } = await client.query({ query: myPosts });
  expect(data.myPosts.length).toBe(2);
});

test("Should be able to create own post", async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: postOne.input.id,
    data: {
      title: "UPDATED"
    }
  };

  const { data } = await client.mutate({ mutation: updatePost, variables });
  expect(data.updatePost.title).toBe("UPDATED");
});

test("Should be able to create own post", async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    data: {
      title: "Matt is posting",
      body: "Matt body",
      published: true
    }
  };

  const { data } = await client.mutate({ mutation: createPost, variables });
  expect(data.createPost.title).toBe("Matt is posting");
});

test("Should delete a post", async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: `${postTwo.post.id}`
  };

  await client.mutate({ mutation: deletePost, variables });
  const postExist = await prisma.exists.Post({ id: postTwo.post.id }); // careful here promise returns TRUE
  expect(postExist).toBe(false);
});

// test post subscription. However, can't update postOne why? 
// needed to test postTwo and it worked out
test("Should subscribe to posts", async done => {
  client.subscribe({ query: subscribeToPosts }).subscribe({
    next(response) {
      console.log(response);
      expect(response.data.post.mutation).toBe("UPDATED");
      done();
    }
  });

    await prisma.mutation.updatePost({
      where: {
        id: postTwo.post.id
      },
      data: {
        published: true
      }
    });
});
