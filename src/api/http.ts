import axios, { type AxiosInstance } from 'axios'
import { toApiError } from './errors'

/**
 * 全站唯一的 Axios instance 與攔截器。
 *
 * 目前沒有真實後端：baseURL 由環境變數 VITE_API_BASE_URL 提供，未設定時留空（走相對路徑），
 * 不在程式碼中寫死任何 API 網址、Token 或後端回應格式。
 */

/** 共用請求逾時時間（毫秒）。 */
export const REQUEST_TIMEOUT_MS = 10_000

/** API 根位址；未設定時為空字串。 */
const baseURL: string = import.meta.env.VITE_API_BASE_URL ?? ''

/** 共用請求實例：所有請求都應從這裡發出，不要另外建立 instance。 */
export const http: AxiosInstance = axios.create({
  baseURL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
  },
})

/**
 * Request Interceptor：請求送出前的最後一站。
 * 目前只保留共用請求設定的位置；之後要附加 Authorization 等驗證資訊時一律加在這裡，
 * 不要在各個元件或 service 中重複設定。
 */
http.interceptors.request.use((config) => config)

/**
 * Response Interceptor：回應進來的第一站。
 * 成功時原樣回傳 response，不假設後端回應的 envelope 格式；
 * 失敗時統一轉成 ApiError 後再 reject，錯誤不會被吞掉，呼叫端仍可用 try/catch 處理。
 */
http.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
)
