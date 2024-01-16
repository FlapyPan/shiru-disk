/** @typedef {'GET' | 'POST' | 'PUT' | 'DELETE'} HttpMethod http 请求方法 */

/**
 * @typedef {object} ApiOptions
 * @property {string|URL} url  请求路径
 * @property {HttpMethod?} method 请求方法
 * @property {any?} payload 请求数据
 * @property {boolean?} jsonPayload payload 是否为 json
 */

import { useToast } from 'vue-toastification'

const toast = useToast()

/**
 * 封装的 fetch api, 请求和响应全部使用 json
 * @param {ApiOptions} options
 * @return {Promise<*>}
 */
export default async function api(
  options = {
    url: '',
    method: 'GET',
    payload: undefined,
    jsonPayload: true,
  },
) {
  const { url, method, payload, jsonPayload } = options
  const headers = {}
  if (jsonPayload) headers['Content-Type'] = 'application/json'
  const body = payload ? (jsonPayload ? JSON.stringify(payload) : payload) : undefined
  try {
    const response = await fetch(`/api${url}`, {
      method,
      headers,
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      body,
    })
    const json = await response.json()
    if (!response.ok) throw json
    return json
  } catch (e) {
    if (e.statusCode === 401) useAuth().logout()
    console.error(e)
    toast.error(e.message || '未知错误')
    throw e
  }
}

/**
 * @param {string} url
 * @return {Promise<*>}
 */
api.get = (url) => api({ url })
/**
 * @param {string} url
 * @param {any?} payload
 * @param {boolean} jsonPayload
 * @return {Promise<*>}
 */
api.post = (url, payload = undefined, jsonPayload = true) => api({ url, method: 'POST', payload, jsonPayload })
/**
 * @param {string} url
 * @param {any?} payload
 * @param {boolean} jsonPayload
 * @return {Promise<*>}
 */
api.put = (url, payload = undefined, jsonPayload = true) => api({ url, method: 'PUT', payload, jsonPayload })
/**
 * @param {string} url
 * @return {Promise<*>}
 */
api.delete = (url) => api({ url, method: 'DELETE' })
