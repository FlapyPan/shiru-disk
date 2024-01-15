import z from 'zod'

export default eventHandler(async (event) => {
  const data = await readSafeBody(event, {
    _id: z.string(),
    path: z.string(),
  })
  const file = await Files.findById(data._id)
  if (!file) {
    throw createError({ statusCode: 404, message: '不存在的文件(夹)' })
  }
  const now = new Date()
  await Files.updateOne({ _id: data._id }, { $set: { path: data.path, updatedAt: new Date() } })
  if (!file.isDir) return {}
  // 如果是文件夹，需要移动内部的文件和文件夹路径
  const parentOldPath = file.path
  const oldPath = `${parentOldPath === '/' ? '' : parentOldPath}/${file.filename}`
  const newPath = `${data.path === '/' ? '' : data.path}/${file.filename}`
  const subFiles = await Files.find({
    userId: file.userId,
    path: { $regex: `^${oldPath}` },
  })
  const copyTask = subFiles.map((subFile) =>
    Files.updateOne(
      { _id: subFile._id },
      {
        $set: {
          path: subFile.path.replace(new RegExp(`^${oldPath}`), newPath),
          updatedAt: now,
        },
      }
    )
  )
  await Promise.all(copyTask)
  return {}
})
