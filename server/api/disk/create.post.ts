import z from 'zod';

export default eventHandler(async (event) => {
  const data = await readSafeBody(event, {
    filename: z.string(),
    path: z.string(),
    storeId: z.string().nullish(),
    mimeType: z.string().nullish(),
    isDir: z.boolean().nullish(),
    size: z.number().nullish(),
  });
  const userId = getUserId(event);
  // 检查文件夹或文件名是否重复
  const exists = await Files.exists({
    userId,
    path: data.path,
    filename: data.filename,
    isDir: data.isDir,
    deleted: false,
  });
  if (exists) {
    throw createError({ statusCode: 400, message: `"${data.filename}"已存在` });
  }
  await new Files({ ...data, userId }).save();
  return {};
});
