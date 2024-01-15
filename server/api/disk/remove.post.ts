import z from 'zod'

export default eventHandler(async (event) => {
  const data = await readSafeBody(event, {
    _id: z.string(),
  })
  const file = await Files.findById(data._id)
  if (!file) {
    throw createError({ statusCode: 404, message: '不存在的文件(夹)' })
  }
  const now = new Date()
  await Files.updateOne(
    { _id: data._id },
    { $set: { deleted: true, updatedAt: now } },
  )
  if (!file.isDir) return {}
  // 如果是文件夹，需要删除内部的文件和文件夹路径
  const parentPath = file.path
  const path = `${parentPath === '/' ? '' : parentPath}/${file.filename}`
  await Files.updateMany(
    {
      userId: file.userId,
      path: { $regex: `^${path}` },
    },
    {
      $set: { deleted: true, updatedAt: now },
    },
  )
  return {}
})
