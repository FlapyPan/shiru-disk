import z from 'zod'

export default eventHandler(async (event) => {
  const { userId } = readParams(event, { userId: z.string() })
  const user = await Users.findById(userId)
  if (!user) {
    throw createError({ statusCode: 404, message: '不存在的用户' })
  }
  return user.avatar
})
