import "@babel/polyfill";
import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import seedDatabase, { userOne } from "./utils/seedDatabase";
import getClient from "./utils/getClient";

const client = getClient();

beforeEach(seedDatabase);
test("Should expose public posts", async () => {
  const getPosts = gql`
    query {
      posts {
        id
        title
        body
        published
      }
    }
  `;

  const posts = await client.query({ query: getPosts });
  expect(posts.data.posts.length).toBe(1);
  expect(posts.data.posts[0].title).toBe("Matt title 1");
  expect(posts.data.posts[0].body).toBe("Matt body 1");
  expect(posts.data.posts[0].published).toBe(true);
});

test("Should fetch user posts", async () => {
  const client = getClient(userOne.jwt);

  const myPosts = gql`
    query {
      myPosts(query: "") {
        id
        title
      }
    }
  `;

  const { data } = await client.query({ query: myPosts });
  expect(data.myPosts.length).toBe(2);
});
