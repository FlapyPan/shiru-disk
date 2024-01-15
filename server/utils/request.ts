import type { ZodRawShape } from 'zod/lib/types'
import type { EventHandlerRequest, H3Event } from 'h3'
import type { ObjectId } from 'bson'
import z from 'zod'
import { useLogger } from '@nuxt/kit'

const logger = useLogger('utils-request')

function parse<T extends ZodRawShape>(data: unknown, shape: T) {
  const result = z.object(shape).safeParse(data)
  if (!result.success) {
    logger.warn(`表单校验错误`, result.error)
    throw createError({ statusCode: 400, message: result.error.toString() })
  }
  return result.data
}

export async function readSafeBody<T extends ZodRawShape>(event: H3Event<EventHandlerRequest>, shape: T) {
  const data = await readBody(event)
  return parse(data, shape)
}

export function readParams<T extends ZodRawShape>(event: H3Event<EventHandlerRequest>, shape: T) {
  const data = event.context.params
  return parse(data, shape)
}

export function getUserId(event: H3Event<EventHandlerRequest>): string | ObjectId {
  const userId = event.context.user?._id
  if (!userId) {
    throw createError({ statusCode: 401, message: '请登录' })
  }
  return userId
}
