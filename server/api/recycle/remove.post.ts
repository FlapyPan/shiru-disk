import z from 'zod'

export default eventHandler(async (event) => {
  const data = await readSafeBody(event, {
    _id: z.string(),
  })
  const file = await Files.findById(data._id)
  if (!file) {
    throw createError({ statusCode: 404, message: '不存在的文件(夹)' })
  }
  await Files.deleteOne({ _id: data._id })
  if (!file.isDir) return {}
  // 如果是文件夹，需要删除内部的文件和文件夹
  const parentPath = file.path
  const path = `${parentPath === '/' ? '' : parentPath}/${file.filename}`
  await Files.deleteMany({
    userId: file.userId,
    path: { $regex: `^${path}` },
  })
  return {}
})
