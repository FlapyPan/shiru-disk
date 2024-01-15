import z from 'zod'
import { useLogger } from '@nuxt/kit'

const logger = useLogger('验证码接口[POST /api/auth/captcha]')
const captchaCache = CaptchaCache.getInstance()

export default eventHandler(async (event) => {
  const { phone } = await readSafeBody(event, {
    phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入正确的手机号'),
  })
  const captcha = getCaptcha(phone)
  logger.info(`手机号：${phone}, 验证码: ${captcha}`)
  captchaCache.addCaptcha(phone, captcha)
  // TODO 发送验证码
  return {}
})

function getCaptcha(phone: string): string {
  const cachedCaptcha = captchaCache.getCaptcha(phone)
  if (cachedCaptcha) {
    if (Date.now() - cachedCaptcha.sendTime < 60000) {
      throw createError({ statusCode: 400, message: '验证码已发送过' })
    }
    const captcha = cachedCaptcha.captcha
    captchaCache.clearCaptcha(phone)
    return captcha
  }
  return (Math.floor(Math.random() * 90000) + 10000).toString()
}
