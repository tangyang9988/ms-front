import Layout from '@/page/index/'

export default [{
		path: '/login',
		name: '登录页',
		component: () =>
			import( /* webpackChunkName: "page" */ '@/page/login/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},

  {
    path: '/system',
    name: '免登录页',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/page/login/system'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },

  {
    path: '/autoLogin',
    name: '免登录页',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/page/login/autoLogin'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },

  {
    path: '/autoLoginError',
    name: '自动登录错误提示',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/page/login/autoLoginError'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },

	{
		path: '/lock',
		name: '锁屏页',
		component: () =>
			import( /* webpackChunkName: "page" */ '@/page/lock/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/404',
		component: () =>
			import( /* webpackChunkName: "page" */ '@/components/error-page/404'),
		name: '404',
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}

	},
	{
		path: '/403',
		component: () =>
			import( /* webpackChunkName: "page" */ '@/components/error-page/403'),
		name: '403',
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/500',
		component: () =>
			import( /* webpackChunkName: "page" */ '@/components/error-page/500'),
		name: '500',
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/',
		name: '主页',
		redirect: '/wel'
	},
	{
		path: '/myiframe',
		component: Layout,
		redirect: '/myiframe',
		children: [{
			path: ":routerPath",
			name: 'iframe',
			component: () =>
				import( /* webpackChunkName: "page" */ '@/components/iframe/main'),
			props: true
		}]
	},
	{
		path: '*',
		redirect: '/login'
	}
]
