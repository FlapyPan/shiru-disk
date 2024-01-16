import type { IFile } from '~/types/models'
import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema } from 'mongoose'


// 文件模型
export const Files = defineMongooseModel<IFile>('File', {
  // 用户id
  userId: { type: Schema.Types.ObjectId },
  //  是否是文件夹
  isDir: { type: Boolean, default: false },
  // 文件名
  filename: { type: String, required: true },
  // 文件路径
  path: { type: String, required: true },
  // 文件大小
  size: { type: String },
  // 对象存储的id
  storeId: { type: String },
  // 文件类型
  mimeType: { type: String },
  // 是否删除
  deleted: { type: Boolean, default: false },
  // 创建时间
  createdAt: { type: Date, default: () => new Date() },
  // 修改时间
  updatedAt: { type: Date, default: () => new Date() },
})
