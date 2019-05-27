import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../src/prisma";

const userOne = {
  input: {
    name: "Matt",
    email: "matt@gmail.com",
    password: bcrypt.hashSync("mattmatt")
  },
  user: undefined,
  jwt: undefined
};

const userTwo = {
  input: {
    name: "Batse",
    email: "batse@gmail.com",
    password: bcrypt.hashSync("batsebatse")
  },
  user: undefined,
  jwt: undefined
}

const postOne = {
  input: undefined
}

const postTwo = {
  input: {
    title: "Matt title 2",
    body: "Matt body 2",
    published: false
  },
  post: undefined
}

const commentOne = {
  text: "Matt's comment",
  comment: undefined
}

const seedDatabase = async () => {
  // delete test data
  jest.setTimeout(10000); // if you are having slow internet issue
  await prisma.mutation.deleteManyComments();
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // create userOne
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });

  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  // create posts
  postOne.input = await prisma.mutation.createPost({
    data: {
      author: {
        connect: {
          id: userOne.user.id
        }
      },
      title: "Matt title 1",
      body: "Matt body 1",
      published: true
    } 
  });

  postTwo.post = await prisma.mutation.createPost({
    data: {
      author: {
        connect: {
          id: userOne.user.id
        }
      },
    ...postTwo.input
    }
  });

  // create user two
  userTwo.user = await prisma.mutation.createUser({ data: userTwo.input })
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)


  // create comments
  commentOne.comment = await prisma.mutation.createComment({
    data: {
      text: commentOne.text, 
      author_id: {
        connect: {
          id: userOne.user.id
        }
      }, 
      post_id: {
        connect: {
          id: postOne.input.id
        }	
      }
    }
  })
  




}
export { seedDatabase as default, userOne, userTwo, postOne, postTwo, commentOne };
