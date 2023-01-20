import NProgress from "@/config/nprogress"
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"
import { showFullScreenLoading, tryHideFullScreenLoading } from "@/config/serviceLoading"
import { ResultData } from "./interface"
import { ResuleEnum } from "@/enum/httpEnum"
import { checkStatus } from "./helper/checkStatus"
import { AxiosCanceler } from "./helper/axiosCancel"
import { setToken } from "@/redux/modules/global/action"
import { message } from "antd"
import { store } from "@/redux"

const axiosCanceler = new AxiosCanceler()

const config = {
  // 默认请求基础路径，可在 .env 开头文件中修改
  baseURL: import.meta.env.VITE_API_URL as string,
  // 设置超时时间
  timeoout: 10000,
  // 跨域时候允许携带凭证
  withCredentials: true,
}

class RequestHttp {
  service: AxiosInstance
  constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(config)

    /**
     * @description 请求拦截器
     * 客户端发送请求 -》【请求拦截器】 -》 服务器
     * token校验（JWT）：接收服务器返回的token，存储到redux/本地
     */
    this.service.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        NProgress.start()
        // 将当前请求添加到pending中
        axiosCanceler.addPending(config)
        // 如果当前请求不需要loading在api服务中通过指定的第三个参数: { headers: { noLoading: true } }来控制不显示loading，参见loginApi
        config.headers!.loading || showFullScreenLoading()
        const token: string = store.getState().global.token
        return { ...config, headers: { ...config.headers, "x-access-token": token } }
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    /**
     * @description 响应拦截器
     * 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data, config } = response
        NProgress.done()
        // 请求结束后，移除本次请求(关闭loading)
        axiosCanceler.removePending(config)
        tryHideFullScreenLoading()
        // 登陆失效 (code === 599)
        if (data.code == ResuleEnum.OVERRUE) {
          store.dispatch(setToken(""))
          message.error(data.msg)
          window.location.hash = "/login"
          return Promise.reject(data)
        }
        // 全局错误消息拦截（防止下载文件时，返回数据流，没有code，直接报错）
        if (data.code && data.code !== ResuleEnum.SUCCESS) {
          message.error(data.msg)
          return Promise.reject(data)
        }
        // 成功请求
        return data
      },
      async (error: AxiosError) => {
        const { response } = error
        NProgress.done()
        tryHideFullScreenLoading()
        // 请求超时单独判断，请求超时没有reponse
        if (error.message.indexOf("timeout") !== -1) message.error("请求超时，请稍后再试")
        // 根据错误码，做不同处理
        if (response) checkStatus(response.status)
        // 服务器都没有返回结果（可能断网）
        if (!window.navigator.onLine) window.location.hash = "/500"
        return Promise.reject(error)
      }
    )
  }

  // 常用请求方法封装
  get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.get(url, { params, ..._object })
  }
  post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.post(url, params, _object)
  }
  put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.put(url, params, _object)
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    return this.service.delete(url, { params, ..._object })
  }
}

export default new RequestHttp(config)
