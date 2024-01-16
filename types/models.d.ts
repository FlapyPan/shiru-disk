import { Types } from 'mongoose'

export declare interface IUser {
  phone: string
  nickname: string
  avatar: Buffer
  roles: string[]
  createdAt: Date
}

export declare interface IFile {
  userId: Types.ObjectId
  isDir: boolean
  filename: string
  path: string
  size: string
  storeId: string
  mimeType: string
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export declare interface IShare {
  userId: Types.ObjectId
  fileIds: Types.ObjectId[]
  title: string
  about: string
  createdAt: Date
  updatedAt: Date
}
