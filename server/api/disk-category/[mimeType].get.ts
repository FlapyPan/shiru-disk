import z from 'zod'

export default eventHandler((event) => {
  const { mimeType } = readParams(event, { mimeType: z.string() })
  let mimeTypeRegExp = '.'
  switch (mimeType) {
    case 'image':
    case 'video':
    case 'audio':
      mimeTypeRegExp = `^${mimeType}`
      break
    case 'doc':
      mimeTypeRegExp =
        '^(application/vnd.openxmlformats|application/msword|application/pdf|application/vnd.ms-excel|application/vnd.ms-powerpoint)'
      break
    case 'other':
      mimeTypeRegExp = `^(?!image|video|audio|application/vnd.openxmlformats|application/msword|application/pdf|application/vnd.ms-excel|application/vnd.ms-powerpoint).*`
  }
  return Files.find(
    { userId: getUserId(event), deleted: false, isDir: false, mimeType: { $regex: mimeTypeRegExp } },
    {},
    { sort: { path: 1, filename: 1, createdAt: -1, updatedAt: -1 } },
  )
})
