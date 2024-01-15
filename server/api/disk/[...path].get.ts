import z from 'zod'

export default eventHandler((event) => {
  const { path } = readParams(event, { path: z.string() })
  const decodedPath = decodeURI(path)
  return Files.find(
    { userId: getUserId(event), path: `/${decodedPath}`, deleted: false },
    {},
    { sort: { isDir: -1, filename: 1, createdAt: -1, updatedAt: -1 } },
  )
})
