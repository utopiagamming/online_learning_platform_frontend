/* http配置 */
// 引入axios以及element ui中的loading和message组件
import axios from 'axios'
import router from "../router";
import { Loading, Message } from 'element-ui'
// 超时时间
// axios.defaults.timeout = 5000
// http请求拦截器
// axios.interceptors.request.use(config => {
//     // element ui Loading方法
//     loadinginstace = Loading.service({ fullscreen: true })
//     return config
// }, error => {
//     loadinginstace.close()
//     Message.error({
//         message: '加载超时'
//     })
//     return Promise.reject(error)
// })

// http响应拦截器
axios.interceptors.response.use(data => {// 响应成功关闭loading
    if (data.data.code=='6666'||data.data.code=='6667') {
        router.push({path: "/login"})
        Message.error({
            message: '登录超时，请重新登录'
        })
    }
    if (data.data.code == '5555' ) {
        router.push({path: "/login"})
        Message.error({
            message: '系统重启中，请稍后登录'
        })
    }
    return data
})
export default axios;
