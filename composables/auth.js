export function useAuth() {
  const user = useState('user', () => ({
    _id: '',
    phone: '',
    nickname: '',
    avatar: '',
    createdAt: '',
    roles: [],
    roleName: '',
  }))
  const token = useCookie('shiru-token')
  const isLogin = computed(() => !!token.value)

  const check = async () => {
    try {
      user.value = await api.get(`/auth`)
    } catch (_) {}
  }

  const login = async (loginForm) => {
    user.value = await api.post(`/auth/login`, { ...loginForm })
  }
  const logout = () => {
    token.value = ''
    user.value = {}
    return reloadNuxtApp()
  }

  return { user, isLogin, check, login, logout }
}
