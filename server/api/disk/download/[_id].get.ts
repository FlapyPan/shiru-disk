import z from 'zod'

export default eventHandler(async (event) => {
  const { _id } = readParams(event, { _id: z.string() })
  const file = await Files.findById(_id)
  if (!file) {
    throw createError({ statusCode: 404, message: '不存在的文件' })
  }
  return minioClient.getObject(MINIO_BUCKET, file.storeId)
})
