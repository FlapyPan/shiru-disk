import type { IUser } from '~/types/models'
import { defineMongooseModel } from '#nuxt/mongoose'


export const Users = defineMongooseModel<IUser>('User', {
  // 手机号
  phone: { type: String, required: true, unique: true },
  // 昵称
  nickname: { type: String },
  // 头像
  avatar: { type: Buffer },
  // 权限
  roles: { type: [String] },
  // 创建时间
  createdAt: { type: Date, default: () => new Date() },
})
