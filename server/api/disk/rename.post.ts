import z from 'zod'

export default eventHandler(async (event) => {
  const data = await readSafeBody(event, {
    _id: z.string(),
    filename: z.string(),
  })
  const file = await Files.findById(data._id)
  if (!file) {
    throw createError({ statusCode: 404, message: '不存在的文件(夹)' })
  }
  await Files.updateOne(
    { _id: data._id },
    { $set: { filename: data.filename, updatedAt: new Date() } },
  )
  if (!file.isDir) return {}
  // 如果是文件夹，需要修改内部的文件和文件夹路径
  const parentPath = file.path === '/' ? '' : file.path
  const oldPath = `${parentPath}/${file.filename}`
  const subFiles = await Files.find({
    userId: file.userId,
    path: { $regex: `^${oldPath}` },
  })
  const newPath = `${parentPath}/${data.filename}`
  const replaceTask = subFiles.map((subFile) => Files.updateOne(
    { _id: subFile._id },
    { $set: { path: subFile.path.replace(new RegExp(`^${oldPath}`), newPath) } },
  ))
  await Promise.all(replaceTask)
  return {}
})
