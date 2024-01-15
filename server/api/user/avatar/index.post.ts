export default eventHandler(async (event) => {
  const multipart = await readMultipartFormData(event)
  if (!multipart || !multipart.length) {
    throw createError({ statusCode: 400, message: '请上传文件' })
  }
  const [data] = multipart
  await Users.updateOne({ _id: getUserId(event) }, { avatar: data.data })
  return {}
})
