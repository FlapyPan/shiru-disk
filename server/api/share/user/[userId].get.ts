export default eventHandler(async (event) => {
  const userId = event.context.params?.userId ?? getUserId(event)
  const shareList = await Shares.find(
    { userId },
    {},
    { sort: { createdAt: -1, updatedAt: -1, title: 1 } },
  )
  return shareList || []
})
