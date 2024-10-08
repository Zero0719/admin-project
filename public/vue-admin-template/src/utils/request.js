import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  responseType: 'arraybuffer'
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
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
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const contentType = response.headers['content-type']

    if (contentType.includes('application/json')) {
      const res = JSON.parse(Buffer.from(response.data).toString('utf8'))

      // if the custom code is not 20000, it is judged as an error.
      if (res.code !== 0) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 3 * 1000
        })

        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        if (res.code === 401 || res.code === 400 || res.code === 50014) {
          // to re-login
          MessageBox.confirm('您的登录已失效，请重新登录', '提示', {
            confirmButtonText: '重 登',
            cancelButtonText: '取 消',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        return res
      }
    } else {
      const contentDisposition = response.headers['content-disposition']
      const filename = contentDisposition ? contentDisposition.split('filename*=UTF-8\'\'')[1] || contentDisposition.split('filename=')[1] : 'downloaded_file'
      const cleanFilename = decodeURIComponent(filename.replace(/"/g, '')) // 清除引号并解码

      const blob = new Blob([response.data], { type: contentType })
      const urlObject = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = urlObject
      a.download = cleanFilename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(urlObject)
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
