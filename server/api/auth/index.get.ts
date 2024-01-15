export default eventHandler(async (event) => {
  const { _id } = checkAuth(event)
  const user = await Users.findById(_id)
  return login(event, user)
})
