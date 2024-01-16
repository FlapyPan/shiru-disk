import type { EventHandlerRequest, H3Event } from 'h3'
import type { Document, Types } from 'mongoose'
import type { IUser } from '~/types/models'
import type { WithId } from 'mongodb'
import crypto from 'node:crypto'
import { sign, verify } from 'jsonwebtoken'

export const TOKEN_COOKIE_KEY = 'shiru-token'
export const AUTH_SECRET = process.env.AUTH_SECRET || crypto.randomUUID()

type ContextUser = Partial<WithId<IUser> & { avatar: string, roleName: string }>

/**
 * 登录
 */
export function login(
  event: H3Event<EventHandlerRequest>,
  user: (Document<unknown, {}, IUser> & IUser & { _id: Types.ObjectId }) | null,
): ContextUser {
  if (!user || !user._id) {
    throw createError({ statusCode: 401, message: '用户无效' })
  }
  let roleName = '普通用户'
  if (user.roles?.some((r) => r === 'admin')) roleName = '管理员'
  const userInfo: ContextUser = {
    ...user.toObject<any>(),
    avatar: `/api/user/avatar/${user._id}`,
    roleName,
  }
  const token = sign(userInfo, AUTH_SECRET, { expiresIn: '7d' })
  setCookie(event, TOKEN_COOKIE_KEY, token, { sameSite: true, maxAge: 604800 })
  return userInfo
}

/**
 * 获取登录信息
 */
export function checkAuth(event: H3Event<EventHandlerRequest>): ContextUser {
  const token = getCookie(event, TOKEN_COOKIE_KEY)
  if (!token) {
    throw createError({ statusCode: 401, message: '无token' })
  }
  try {
    return verify(token, AUTH_SECRET) as ContextUser
  } catch (e) {
    console.error(e)
    throw createError({ statusCode: 401, message: 'token无效' })
  }
}
