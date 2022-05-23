import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import router from '.'
import { getToken } from '~/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'
import { useUserStore } from '~/store/user'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  console.log('beforeEach')
  // start progress bar
  NProgress.start()

  // set page title
  // document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    const userStore = useUserStore()
    if (!userStore.userProfile?.name)
      userStore.getUserProfile()

    if (to.path === '/login' || to.path === '/register' || to.path === '/') {
      // if is logged in, redirect to the home page
      console.log('redirect to home page')
      next({ path: '/application' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    }
    else {
      next()
    }
  }
  else {
    /* has no token */
    if (whiteList.includes(to.path)) {
      console.log('token not found', to)

      // in the free login whitelist, go directly
      next()
    }
    else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
