import { z } from 'zod'

export default eventHandler(async (event) => {
  const data = await readSafeBody(event, {
    nickname: z.string(),
  })
  await Users.updateOne({ _id: getUserId(event) }, { $set: { nickname: data.nickname } })
  return {}
})
