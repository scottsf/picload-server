import "@babel/polyfill";
import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import seedDatabase, {
  userOne,
  userTwo,
  postOne,
  commentOne
} from "./utils/seedDatabase";
import {
  deleteComment,
  subscribeToComments,
} from "./utils/operations";
import prisma from "../src/prisma";
import getClient from "./utils/getClient";

const client = getClient();
beforeEach(seedDatabase);

test("Should delete own comment", async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: commentOne.comment.id
  };

  const { data } = await client.mutate({ mutation: deleteComment, variables });
  expect(data.deleteComment.text).toBe("Matt's comment");
});

test("Should not delete others comment", async () => {
  const client = getClient(userTwo.jwt);

  const variables = {
    id: commentOne.comment.id
  };

  const response = client.mutate({ mutation: deleteComment, variables });
  await expect(response).rejects.toThrow();
});

test("Should create comment on published post by the first user", async () => {
  const client = getClient(userTwo.jwt);

  const createComment = gql`
    mutation {
      createComment(
        data: { 
            text: "Created comment by the second user", 
            post_id: "${postOne.input.id}"
        }
      ) {
        id
        text
      }
    }
  `;
  const { data } = await client.mutate({ mutation: createComment });
  expect(data.createComment.text).toBe("Created comment by the second user");
});

test("Should subscribe to comments for a post", async done => {
  const variables = {
    post_id: postOne.input.id
  };

  client.subscribe({ query: subscribeToComments, variables }).subscribe({
    next(response) {
      expect(response.data.comment.mutation).toBe("DELETED");
      done();
    }
  });

  // Change comment
  await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id } });
});


