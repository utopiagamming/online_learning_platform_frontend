import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/theme-green/index.css';
import './assets/css/icon.css';
import iView from 'iview'
import 'babel-polyfill';
import axios from 'axios'
import 'iview/dist/styles/iview.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
// require styles
import 'swiper/dist/css/swiper.css'
//全局 VXE
import 'xe-utils'
import store from './store'
import './style/index.less'
//需要按需引入，先引入vue并引入element-ui
import AFTableColumn from 'af-table-column'
import echarts from 'echarts'

// import VueVideoPlayer from "vue-video-player";

Vue.prototype.$echarts = echarts
const fontRate = {
  CHAR_RATE: 0.9, // 汉字比率
  NUM_RATE: 0.5, // 数字
  OTHER_RATE: 0.7 // 除汉字和数字以外的字符的比率
}
const fontSize = 20

// 注册组件
Vue.use(AFTableColumn, { fontRate, fontSize })
Vue.prototype.axios = axios
Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(VueAwesomeSwiper, /* { default global options } */)
Vue.use(ElementUI, {
	size: 'small'
});

//打印组件
import Print from './utils/print'
Vue.use(Print);

// import uploader from "vue-simple-uploader/src";
// Vue.use(uploader);

// Vue.use(VueVideoPlayer);

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers['Content-Type'] = 'application/test;charset=UTF-8';
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function (data) {
	let ret = ''
	for (let it in data) {
		ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	}
	return ret
}]
// 设置请求超时时间
axios.defaults.timeout = 30000000

/**
 * 设置基本的默认路径
 */

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
	document.title = `在线学习平台`;
	const token = sessionStorage.getItem('token');
	if (!token && to.path !== '/login') {
		next('/login');
	} else {
		next()
	}
});

new Vue({
	router,
	store: store,
	render: h => h(App)
}).$mount('#app');

// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
	config => {
		if (localStorage.getItem('Authorization')) {
			config.headers.Authorization = localStorage.getItem('Authorization');
		}
		return config;
	},
	error => {
		console.log(error)
		return Promise.reject(error);
	});