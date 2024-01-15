import z from 'zod'

export default eventHandler(async (event) => {
  const userId = getUserId(event)
  const data = await readSafeBody(event, {
    fileIds: z.array(z.string()),
    title: z.string(),
    about: z.string().nullish(),
  })
  const files = await Files.find({ _id: { $in: data.fileIds }, isDir: false })
  const fileIds = files.map(({ _id }) => _id)
  const { _id } = await new Shares({ ...data, fileIds, userId }).save()
  return { _id }
})
