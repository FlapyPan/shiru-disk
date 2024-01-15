export default eventHandler((event) => {
  return Files.find({
    userId: getUserId(event),
    deleted: true,
  })
})
