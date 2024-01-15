import { defineMongooseModel } from '#nuxt/mongoose'

export interface IUser {
  phone: string;
  nickname: string;
  avatar: Buffer;
  roles: string[];
  createdAt: Date;
}

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
