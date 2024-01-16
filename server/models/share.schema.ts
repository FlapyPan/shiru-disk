import type { IShare } from '~/types/models'
import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema } from 'mongoose'


export const Shares = defineMongooseModel<IShare>('Share', {
  // 用户id
  userId: { type: Schema.Types.ObjectId },
  // 分享的文件id
  fileIds: { type: [Schema.Types.ObjectId] },
  // 分享标题
  title: { type: String, required: true },
  // 分享说明
  about: { type: String },
  // 创建时间
  createdAt: { type: Date, default: () => new Date() },
  // 修改时间
  updatedAt: { type: Date, default: () => new Date() },
})
