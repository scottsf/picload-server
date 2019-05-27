import "@babel/polyfill";
import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import prisma from "../src/prisma";
import seedDatabase, { userOne, userTwo } from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import { createUser, getUsers, getProfile } from "./utils/operations";

const client = getClient();
beforeEach(seedDatabase);

test("Should create a new user", async () => {
  const variables = {
    data: {
      name: "Andrew",
      email: "andrew@gmail.com",
      password: "andrewandrew"
    }
  };

  // const createUser = gql`
  //   mutation {
  //     createUser(
  //       data: { name: "Duck", email: "duck@gmail.com", password: "duckduck" }
  //     ) {
  //       token
  //       user {
  //         id
  //         name
  //       }
  //     }
  //   }
  // `;

  const response = await client.mutate({
    mutation: createUser,
    variables
  });

  const userExists = await prisma.exists.User({
    id: response.data.createUser.user.id
  });
  expect(userExists).toBe(true);
});

test("Should expose public author profiles", async () => {
  const response = await client.query({ query: getUsers });

  expect(response.data.users.length).toBe(2);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe("Matt");
});

test("Should not login with bad credentials", async () => {
  const login = gql`
    mutation {
      login(email: "matt@gmail.com", password: "wrongpassword") {
        token
      }
    }
  `;
  await expect(client.mutate({ mutation: login })).rejects.toThrow();

  // expect(() => {
  //  throw new Element('This is my error')
  // }).toThrow()
});

test("Should not signup when password is shorter than 8 chars", async () => {
  const variables = {
    data: {
      email: "tom@gmail.com",
      name: "Tom",
      password: "abc123"
    }
  };

  const response = client.mutate({ mutation: createUser, variables });
  await expect(response).rejects.toThrow();
});

test("Should fetch user profile", async () => {
  const client = getClient(userOne.jwt);
  const { data } = await client.query({ query: getProfile });
  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
});

test("Should check a second user", async () => {
  expect(userTwo.user.name).toBe("Batse");
});

