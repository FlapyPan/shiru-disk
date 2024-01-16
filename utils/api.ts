import { useToast } from 'vue-toastification'

const toast = useToast()

export default async function api<T = any>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  payload?: any,
  isJson?: boolean,
): Promise<T> {
  const headers: Record<string, string> = {}
  if (isJson) headers['Content-Type'] = 'application/json'
  const body = payload ? (isJson ? JSON.stringify(payload) : payload) : undefined
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
  } catch (e: any) {
    if (e.statusCode === 401) useAuth().logout()
    console.error(e)
    toast.error(e.message || '未知错误')
    throw e
  }
}

api.get = <T = any>(url: string) => api<T>(url, 'GET')

api.post = <T = any>(url: string, payload?: any, isJson: boolean = true) => api<T>(url, 'POST', payload, isJson)

api.put = <T = any>(url: string, payload?: any, isJson: boolean = true) => api<T>(url, 'PUT', payload, isJson)

api.delete = <T = any>(url: string) => api<T>(url, 'DELETE')
