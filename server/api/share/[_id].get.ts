import z from 'zod'

export default eventHandler(async (event) => {
  const { _id } = readParams(event, { _id: z.string() })
  const share = await Shares.findById(_id)
  const user = await Users.findById(share?.userId)
  const shareFiles = await Files.find(
    { _id: { $in: share?.fileIds } },
    { _id: 1, filename: 1, mimeType: 1, storeId: 1 },
  )
  return {
    ...share?.toObject<any>(),
    user: user?.nickname || user?.phone || '未知',
    shareFiles: shareFiles || [],
  }
})
