export default eventHandler((event) => {
  return Files.find(
    { userId: getUserId(event), path: `/`, deleted: false },
    {},
    { sort: { isDir: -1, filename: 1, createdAt: -1, updatedAt: -1 } },
  )
})
