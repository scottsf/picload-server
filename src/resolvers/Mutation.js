import login from './mutations/login'
import createUser from './mutations/createUser'
import deleteUser from './mutations/deleteUser'
import updateUser from './mutations/updateUser'
import createPost from './mutations/createPost'
import deletePost from './mutations/deletePost'
import updatePost from './mutations/updatePost'
import createComment from './mutations/createComment'
import deleteComment from './mutations/deleteComment'
import deleteOthersComment from './mutations/deleteOthersComment'
import updateComment from './mutations/updateComment'
import likePost from './mutations/likePost'
import uploadFile from './mutations/uploadFile'


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
  deleteOthersComment,
  updateComment,
  likePost,
  uploadFile
};

export { Mutation as default };
