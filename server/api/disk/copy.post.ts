import z from 'zod';

export default eventHandler(async (event) => {
  const data = await readSafeBody(event, {
    _id: z.string(),
    path: z.string(),
  });
  const file = await Files.findById(data._id);
  if (!file) {
    throw createError({ statusCode: 404, message: '不存在的文件(夹)' });
  }
  const userId = getUserId(event);
  // 检查文件夹或文件名是否存在
  const exists = await Files.exists({
    userId,
    path: data.path,
    filename: file.filename,
    isDir: file.isDir,
    deleted: false,
  });
  if (exists) {
    throw createError({ statusCode: 400, message: `"${file.filename}"已存在` });
  }
  const now = new Date();
  await new Files({
    ...file.toObject<any>(),
    _id: null,
    path: data.path,
    createdAt: now,
    updatedAt: now,
  }).save();
  if (!file.isDir) return {};
  // 如果是文件夹，需要复制内部的文件和文件夹路径
  const parentOldPath = file.path;
  const oldPath = `${parentOldPath === '/' ? '' : parentOldPath}/${file.filename}`;
  const newPath = `${data.path === '/' ? '' : data.path}/${file.filename}`;
  const subFiles = await Files.find({ userId, path: { $regex: `^${oldPath}` } });
  const copyTask = subFiles.map((subFile) =>
    new Files({
      ...subFile.toObject<any>(),
      _id: null,
      path: subFile.path.replace(new RegExp(`^${oldPath}`), newPath),
      createdAt: now,
      updatedAt: now,
    }).save(),
  );
  await Promise.all(copyTask);
  return {};
});
