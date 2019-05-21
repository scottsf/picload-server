import "@babel/polyfill";
import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import prisma from "../src/prisma";
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { get } from "http";

const client = getClient()

beforeEach(seedDatabase);
test("Should create a new user", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: { name: "Duck", email: "duck@gmail.com", password: "duckduck" }
      ) {
        token
        user {  
          id
          name
        }
      }
    }
  `;

  const response = await client.mutate({
    mutation: createUser
  });

  const userExists = await prisma.exists.User({
    id: response.data.createUser.user.id
  });
  expect(userExists).toBe(true);
});

// test("User should create a post unpublished", async () => {
//   const user = await prisma.query.user({ where: { email: "duck@gmail.com" } });

//   const postUnpublished = await prisma.mutation.createPost({
//     data: {
//       author: {
//         connect: {
//           id: user.id
//         }
//       },
//       title: "Matt title 2",
//       body: "Matt body 2",
//       published: true
//     }
//   });

//   expect(postUnpublished.published).toBe(false);
// });

test('Should expose public author profiles', async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `

  const response = await client.query({ query: getUsers })

  expect(response.data.users.length).toBe(1)
  expect(response.data.users[0].email).toBe(null)
  expect(response.data.users[0].name).toBe('Matt')
})

test('Should not login with bed credentials', async () => {

  const login = gql`
    mutation {
      login(email: "matt@gmail.com", password: "wrongpassword") {
        token
      }
    }
  `
  await expect(client.mutate({ mutation: login })).rejects.toThrow()

  // expect(() => {
  //  throw new Element('This is my error') 
  // }).toThrow()
})

test('Should not signup when password is shorter than 8 chars', async () => {
  const createUser = gql`
    mutation {
      createUser(data: {email: "tom@gmail.com", name: "Tom", password: "abc123"}) {
        token
      }
    }
  `

  const response = client.mutate({ mutation: createUser })
  await expect(response).rejects.toThrow()
})

test('Should fetch user profile', async () => {
  const client = getClient(userOne.jwt)
  const getProfile = gql`
    query {
      me {
        id
        name
        email
      }
    }
  `

  const { data } = await client.query({ query: getProfile })

  expect(data.me.id).toBe(userOne.user.id)
  expect(data.me.name).toBe(userOne.user.name)
})

