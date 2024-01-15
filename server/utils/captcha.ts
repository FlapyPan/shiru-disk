interface CaptchaObject {
  captcha: string,
  sendTime: number,
  expirationTime: number,
}

export class CaptchaCache {
  private static instance: CaptchaCache
  private cache: Map<string, CaptchaObject> = new Map()
  private readonly defaultExpirationTime: number = 300000

  private constructor() {
  }

  // 获取单例实例
  public static getInstance(): CaptchaCache {
    if (!CaptchaCache.instance) {
      CaptchaCache.instance = new CaptchaCache()
    }
    return CaptchaCache.instance
  }

  // 添加验证码到缓存，带有时间限制
  public addCaptcha(key: string, captcha: string, expirationTime?: number) {
    const expiration = expirationTime || this.defaultExpirationTime
    const nowInMillis = Date.now()
    const expirationTimeInMillis = nowInMillis + expiration
    this.cache.set(key, { captcha, sendTime: nowInMillis, expirationTime: expirationTimeInMillis })
  }

  // 从缓存中获取验证码，同时检查是否过期
  public getCaptcha(key: string): CaptchaObject | undefined {
    const entry = this.cache.get(key)
    if (entry && entry.expirationTime > Date.now()) {
      return entry
    } else {
      // 验证码过期，清除缓存
      this.cache.delete(key)
      return undefined
    }
  }

  // 清除特定键的验证码
  public clearCaptcha(key: string): void {
    this.cache.delete(key)
  }

  // 清除所有已过期的验证码
  public clearExpiredCaptcha(): void {
    const currentTime = Date.now()
    this.cache.forEach((entry, key) => {
      if (entry.expirationTime <= currentTime) {
        this.cache.delete(key)
      }
    })
  }
}
