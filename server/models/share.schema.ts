import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema, Types } from 'mongoose'

export interface IShare {
  userId: Types.ObjectId;
  fileIds: Types.ObjectId[];
  title: string;
  about: string;
  createdAt: Date;
  updatedAt: Date;
}

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
