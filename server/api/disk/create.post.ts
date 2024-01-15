import z from 'zod'

export default eventHandler(async (event) => {
  const data = await readSafeBody(event, {
    filename: z.string(),
    path: z.string(),
    storeId: z.string().nullish(),
    mimeType: z.string().nullish(),
    isDir: z.boolean().nullish(),
    size: z.number().nullish(),
  })
  const userId = getUserId(event)
  await new Files({ ...data, userId }).save()
  return {}
})
