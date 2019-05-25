import { gql } from 'apollo-boost'

const createUser = gql`
  mutation($data: createUserInput!) {
    createUser(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const getUsers = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

const getProfile = gql`
  query {
    me {
      id
      name
      email
    }
  }
`;

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

const myPosts = gql`
  query {
    myPosts(query: "") {
      id
      title
    }
  }
`;

const updatePost = gql`
  mutation($id: ID!, $data: updatePostInput!) {
    updatePost(id: $id, data: $data) {
      id
      title
    }
  }
`;

const createPost = gql`
  mutation($data: createPostInput!) {
    createPost(data: $data) {
      id
      title
    }
  }
`;

const deletePost = gql`
  mutation($id: String!) {
    deletePost(id: $id) {
      id
      title
    }
  }
`;

export { 
    createUser, 
    getUsers, 
    getProfile, 
    getPosts, 
    myPosts, 
    updatePost, 
    createPost, 
    deletePost 
};
