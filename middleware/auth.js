export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth()
  if (!auth.isLogin.value) {
    return navigateTo({ path: '/', query: { next: to.path } })
  }
})
