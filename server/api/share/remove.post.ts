import z from 'zod'

export default eventHandler(async (event) => {
  const data = await readSafeBody(event, {
    _id: z.string(),
  })
  await Shares.deleteOne({ _id: data._id, userId: getUserId(event) })
  return {}
})
