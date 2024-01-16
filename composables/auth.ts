function defaultState() {
  return {
    _id: '',
    phone: '',
    nickname: '',
    avatar: '',
    createdAt: '',
    roles: [],
    roleName: '',
  }
}

export function useAuth() {
  const user = useState('user', () => defaultState())
  const token = useCookie('shiru-token')
  const isLogin = computed<boolean>(() => !!token.value)

  const check = async () => {
    try {
      user.value = await api.get(`/auth`)
    } catch (_) {
    }
  }

  const login = async (loginForm: { phone: string, captcha: string }) => {
    user.value = await api.post(`/auth/login`, { ...loginForm })
  }
  const logout = () => {
    token.value = ''
    user.value = defaultState()
    return reloadNuxtApp()
  }

  return { user, isLogin, check, login, logout }
}
