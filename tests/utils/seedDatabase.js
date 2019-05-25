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
  data: {
    name: "Batse",
    email: "batse@gmail.com",
    password: "batsebatse"
  }
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

}
export { seedDatabase as default, userOne, postOne, postTwo };
