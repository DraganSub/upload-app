export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseSession();

  if (user.value) {
    return navigateTo('/');
  }
});