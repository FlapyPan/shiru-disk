export default eventHandler(async (event) => {
  const user = await Users.findById(getUserId(event))
  if (!user) {
    throw createError({ statusCode: 401, message: '账户无效' })
  }
  return login(event, user)
})
