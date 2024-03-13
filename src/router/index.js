import Vue from 'vue';
import Router from 'vue-router';

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return routerPush.call(this, location)
}
Vue.use(Router);

export default new Router({

	mode: 'history',
	routes: [
		{
			path: '/',
			redirect: '/dashboard'
		},
		{
			path: '/',
			component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
			meta: { title: '自述文件' },
			children: [
				// 系统管理
				{
					path: '/MenuInfo',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/system/MenuInfo.vue'),
					meta: { title: '菜单管理' }
				},
				{
					path: '/RoleInfo',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/system/RoleInfo.vue'),
					meta: { title: '角色管理' }
				},
				{
					path: '/UserInfo',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/system/UserInfo.vue'),
					meta: { title: '用户管理' }
				},
				{
					path: '/UpdatePassWord',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/system/UpdatePassWord.vue'),
					meta: { title: '系统管理' }
				},

				// 考试管理
				{
					path: '/answer',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/examination/answer.vue'),
					meta: { title: '在线考试' }
				},
				{
					path: '/Papers',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/examination/Papers.vue'),
					meta: { title: '试卷管理' }
				},
				{
					path: '/Subject',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/examination/Subject.vue'),
					meta: { title: '科目管理' }
				},
				{
					path: '/Questions',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/examination/Questions.vue'),
					meta: { title: '习题管理' }
				},
				{
					path:'/Section',
					component:()=>import('../components/page/examination/Section'),
					meta:{title: '章节管理'}
				},
				{
					path: '/examinationRecord',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/examination/examinationRecord.vue'),
					meta: { title: '考试记录' }
				},
				{
					path: '/AutoPaper2',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/examination/AutoPaper.vue'),
					// meta: { title: '在线组卷' }
				},

				// 班级管理页面
				{
					path: '/subsection',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/class/subsection.vue'),
					meta: { title: '成绩分段' }
				},
				{
					path: '/achievement',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/class/achievement.vue'),
					meta: { title: '成绩管理' }
				},
				{
					path: '/classInfo',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/class/classInfo.vue'),
					meta: { title: '班级管理' }
				},

				// 学习管理
				{
					path:'/Videos',
					component:()=>import('../components/page/study/Videos'),
					meta:{title: '视频观看'}
				},
				{
					path:'/Upload',
					component:()=>import('../components/page/study/Upload'),
					meta:{title: '视频管理'}
				},
				{
					path:'/ErrorDetail',
					component:()=>import('../components/page/study/ErrorDetail'),
					meta:{title: '错误情况'}
				},
				{
					path:'/conceptTree',
					component:()=>import('../components/page/study/conceptTree'),
					meta:{title:'知识点树'}
				},
				{
					path:'/KnowledgeGraph',
					component:()=>import('../components/page/study/KnowledgeGraph'),
					meta:{title:'知识架构'}
				},
				// {
				// 	path:'/chapTree',
				// 	component:()=>import('../components/common/chapTree'),
				// 	meta:{title:'树结构测试'}
				// },

				// 其他页面
				{
					path: '/dashboard',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
					meta: { title: '系统首页' }
				},
				{
					path: '/404',
					component: () => import( /* webpackChunkName: "404" */ '../components/page/404.vue'),
					meta: {
						title: '404'
					}
				},
				{
					path: '/403',
					component: () => import( /* webpackChunkName: "403" */ '../components/page/403.vue'),
					meta: {
						title: '403'
					}
				},

			]
		},
		{
			path: '/login',
			component: () => import( /* webpackChunkName: "login" */ '../components/page/Login.vue')
		},

		{
			path: '*',
			redirect: '/404'
		}
	]
});
