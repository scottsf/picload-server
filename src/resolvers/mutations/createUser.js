import generateToken from "../../utils/generateToken";
import hashPassword from "../../utils/hashPassword";

// Take in password -> Validate password -> Hash password -> Generate auth token
// JSON Web Token (JWT)

const createUser = async (parent, args, { prisma }, info) => {
  const password = await hashPassword(args.data.password)

  const emailExist = await prisma.exists.User({
    email: args.data.email
  })

  if (emailExist) throw new Error('User already exists')

  const user = await prisma.mutation.createUser({
    data: {
      ...args.data,
      password
    }
  });

  return {
    user,
    token: generateToken(user.id)
  };
};

export { createUser as default };
