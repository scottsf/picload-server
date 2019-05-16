import getUserId from "../../utils/getUserId";

const deleteUser = async (parent, args, { prisma, request }, info) => {
  const userId = getUserId(request);
  return prisma.mutation.deleteUser({ where: { id: userId } });
};

export { deleteUser as default };
