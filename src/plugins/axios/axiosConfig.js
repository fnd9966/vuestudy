import axios from 'axios'
import Qs from 'qs'
export default (axiosConfig, conf, url) => {
  // 默认为 测试环境
  let { baseUrl } = axiosConfig
  let { method = 'get', data = {}, headers = {}, dataType = 'json' } = conf
  // 正式环境
  if (process.env.PATH_ENV === 'production') {
    baseUrl = axiosConfig.prodUrl || baseUrl
  }

  headers = Object.assign(method === 'get' ? {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=UTF-8'
  } : {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }, headers)

  // 创建实例时设置的默认值
  let _createConfig = {
    baseUrl,
    method,
    // headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    headers,
    data: data,
    params: data,
    responseType: dataType
  }

  if (method === 'get') {
    delete _createConfig.data
  } else {
    delete _createConfig.params
    const contentType = headers['Content-Type']

    if (typeof contentType !== 'undefined') {
      if (~contentType.indexOf('multipart')) {
        // 类型'multipart/form-data'
        _createConfig.data = data
      } else if (~contentType.indexOf('json')) {
        // 类型'application/json'
        // 服务器收到的原始数据（raw body) "{name: "test", sex: "man"}"普通字符串
        _createConfig.data = JSON.stringify(data)
      } else {
        // 类型application/x-www-form-urlencoded
        // 服务器收到的原始数据（raw body）name=test&sex=man
        _createConfig.data = Qs.stringify(data)
      }
    }
  }
  // if (typeof axiosConfig.createConfig === 'object') {
  //   let { createConfig } = axiosConfig
  //   if (typeof createConfig.headers === 'object') {
  //     _createConfig.headers = Object.assign(
  //       _createConfig.headers,
  //       createConfig.headers
  //     )
  //   }
  //   _createConfig = Object.assign(_createConfig, createConfig)
  // }
  function checkStatus (response) {
    // 如果http状态码正常，则直接返回数据
    if (response) {
      // -1000 自己定义，连接错误的status
      const status = response.status || -1000
      if ((status >= 200 && status < 300) || status === 304) {
        // 如果不需要除了data之外的数据，可以直接 return response.data
        return response.data
      } else {
        let errorInfo = ''
        switch (status) {
          case -1:
            errorInfo = '远程服务响应失败,请稍后重试'
            break
          case 400:
            errorInfo = '400: 错误请求'
            break
          case 401:
            errorInfo = '401: 访问令牌无效或已过期'
            break
          case 403:
            errorInfo = '403: 拒绝访问'
            break
          case 404:
            errorInfo = '404：资源不存在'
            break
          case 405:
            errorInfo = '405: 请求方法未允许'
            break
          case 408:
            errorInfo = '408: 请求超时'
            break
          case 500:
            errorInfo = '500：访问服务失败'
            break
          case 501:
            errorInfo = '501：未实现'
            break
          case 502:
            errorInfo = '502：无效网关'
            break
          case 503:
            errorInfo = '503: 服务不可用'
            break
          default:
            errorInfo = `连接错误${status}`
        }
        return {
          status,
          msg: errorInfo
        }
      }
    }
    // 异常状态下，把错误信息返回去
    return {
      status: -404,
      msg: '网络异常'
    }
  }
  const Service = axios.create(_createConfig)

  // 添加请求拦截器
  Service.interceptors.request.use(
    config => {
      // post 传参序列化
      // if (config.methods === 'post') {
      //   config.data = qs.stringify(config.data)
      // }
      // 在发送请求之前做些什么
      if (typeof axiosConfig.beforeRequest === 'function') {
        return axiosConfig.beforeRequest(config)
      }
      return config
    },
    error => {
      // 对请求错误做些什么
      return Promise.reject(error)
    }
  )

  // 添加响应拦截器
  Service.interceptors.response.use(
    response => {
      // if (typeof axiosConfig.responseSuccess === 'function') {
      //   return axiosConfig.responseSuccess(response)
      // }
      // return response.data
      return checkStatus(response)
    },
    error => {
      if (typeof axiosConfig.responseError === 'function') {
        axiosConfig.responseError(error)
      }
      return Promise.reject(checkStatus(error))
    }
  )
  return Service[_createConfig.method](url, [_createConfig])
}
