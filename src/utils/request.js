import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
    baseURL: process.env.NODE_ENV == "development" ? "/api" : "https://red.xmhongqu.com/api",
    timeout: 5000
})

// request interceptor
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            config.headers['authorization'] = getToken()
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code !== 200) {
            // 401: Token invalid;
            if (res.code === 401) {
                MessageBox({
                    title: '系统提示',
                    message: '登录失效，请重新登录',
                    type: 'warning',
                    confirmButtonText: "去登录"
                }).then(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                })
            } else {
                Message({
                    message: res.message || 'Error',
                    type: 'error',
                    duration: 5 * 1000
                })
            }
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res.data
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service