import getUserId from "../../utils/getUserId";
import hashPassword from "../../utils/hashPassword"

const updateUser = async (parent, args, { prisma, request }, info) => {
  const userId = getUserId(request);

  if (typeof args.data.password === 'string') {
    const password = await hashPassword(args.data.password)
    console.log(password)
    args.data.password = password 
  } 

  return prisma.mutation.updateUser(
    {
      where: {
        id: userId
      },
      data: args.data
    },
    info
  );
};

export { updateUser as default };
