import { randomUUID } from 'node:crypto'

export default eventHandler(async (event) => {
  const multipart = await readMultipartFormData(event)
  if (!multipart || !multipart.length) {
    throw createError({ statusCode: 400, message: '请上传文件' })
  }
  const [data] = multipart
  const storeId = randomUUID()
  await minioClient.putObject(MINIO_BUCKET, storeId, data.data)
  return { storeId }
})
