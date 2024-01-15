import z from 'zod'

const captchaCache = CaptchaCache.getInstance()

export default eventHandler(async (event) => {
  const { phone, captcha } = await readSafeBody(event, {
    phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入正确的手机号'),
    captcha: z.string().length(5, '请输入正确的验证码'),
  })
  // 校验验证码
  const cachedCaptcha = captchaCache.getCaptcha(phone)
  if (!cachedCaptcha) {
    throw createError({ statusCode: 400, message: '验证码已过期' })
  }
  if (cachedCaptcha.captcha !== captcha) {
    throw createError({ statusCode: 400, message: '请输入正确的验证码' })
  }
  captchaCache.clearCaptcha(phone)
  const user = await findOrCreateUser(phone)
  return login(event, user)
})

async function findOrCreateUser(phone: string) {
  const user = await Users.findOne({ phone })
  if (user) return user
  await Users.create({ phone })
  return Users.findOne({ phone })
}
