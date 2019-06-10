import bcrypt from 'bcryptjs'
import generateToken from '../../utils/generateToken'

const login = async (parent, args, { prisma }, info) => {
    const user = await prisma.query.user({where: {email: args.email}})
    if (!user) throw new Error('User does not exist')
    const isMatch = await bcrypt.compare(args.password, user.password)

    if (!isMatch) {
      throw new Error('Password is not matching')
    } 

    return {
      user,
      token: generateToken(user.id)
    }
  }

export { login as default }