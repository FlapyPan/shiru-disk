import type { HTTPMethod } from 'h3'
import { checkAuth } from '~/server/utils/jwt'

const skipAuthPaths = [
  ['GET', '/api/ping'],
  ['POST', '/api/auth'],
]

function check(method: HTTPMethod, path: string): boolean {
  return !skipAuthPaths.some(([m, p]) => method === m && path.startsWith(p))
}

export default eventHandler((event) => {
  const { method, path } = event
  if (method === 'GET' && !path.startsWith('/api')) return
  if (check(method, path)) {
    event.context.user = checkAuth(event)
  }
})
