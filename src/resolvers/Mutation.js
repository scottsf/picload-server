import login from './mutations/login'
import createUser from './mutations/createUser'
import deleteUser from './mutations/deleteUser'
import updateUser from './mutations/updateUser'
import createPost from './mutations/createPost'
import deletePost from './mutations/deletePost'
import updatePost from './mutations/updatePost'
import createComment from './mutations/createComment'
import deleteComment from './mutations/deleteComment'
import updateComment from './mutations/updateComment'


const Mutation = {
  login,
  createUser,
  deleteUser,
  updateUser,
  createPost,
  deletePost,
  updatePost,
  createComment,
  deleteComment,
  updateComment
};

export { Mutation as default };
