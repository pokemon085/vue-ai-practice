import axios from 'axios'

/**
 * 統一錯誤型別與正規化。
 *
 * axios 依失敗原因會拋出形狀不同的錯誤（HTTP 狀態錯誤、連不上網路、逾時、主動取消），
 * 這裡把它們收斂成單一的 ApiError，呼叫端只需要判斷一種型別。
 * 轉換後仍以 Promise.reject 拋出，錯誤不會被吞掉，呼叫端可自行以 try/catch 決定如何處理。
 */

/** 錯誤種類：HTTP 狀態錯誤、網路錯誤、逾時、請求取消、其他未預期錯誤。 */
export type ApiErrorKind = 'http' | 'network' | 'timeout' | 'canceled' | 'unknown'

interface ApiErrorInit {
  /** HTTP 狀態碼；非 HTTP 錯誤時為 null。 */
  status?: number
  /** axios 的錯誤代碼，例如 'ECONNABORTED'。 */
  code?: string
  /** 回應內容；目前沒有後端，格式未知因此為 unknown，需要時由呼叫端收斂。 */
  data?: unknown
  /** 原始錯誤，保留供除錯使用。 */
  cause?: unknown
}

/** 全站統一的 API 錯誤型別。 */
export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status: number | null
  readonly code: string | null
  readonly data: unknown

  constructor(kind: ApiErrorKind, message: string, init: ApiErrorInit = {}) {
    super(message, { cause: init.cause })
    this.name = 'ApiError'
    this.kind = kind
    this.status = init.status ?? null
    this.code = init.code ?? null
    this.data = init.data
  }
}

/** 判斷是否為本專案統一的 ApiError。 */
export const isApiError = (value: unknown): value is ApiError => value instanceof ApiError

/** 各錯誤種類的預設訊息：後端沒有提供可讀訊息時使用。 */
const defaultMessages: Record<ApiErrorKind, string> = {
  http: '伺服器回應錯誤狀態',
  network: '無法連線至伺服器',
  timeout: '請求逾時',
  canceled: '請求已取消',
  unknown: '發生未預期的錯誤',
}

/** axios 逾時與被中止會回報相同的 ECONNABORTED，因此一併比對 ETIMEDOUT。 */
const timeoutCodes = ['ECONNABORTED', 'ETIMEDOUT']

/**
 * 把任何被拋出的值轉成 ApiError。
 * 已經是 ApiError 時原樣回傳，因此重複經過攔截器也不會被包成兩層。
 */
export const toApiError = (error: unknown): ApiError => {
  if (isApiError(error)) return error

  if (axios.isAxiosError(error)) {
    const { code, response } = error

    if (axios.isCancel(error)) {
      return new ApiError('canceled', defaultMessages.canceled, { code, cause: error })
    }

    if (code !== undefined && timeoutCodes.includes(code)) {
      return new ApiError('timeout', defaultMessages.timeout, { code, cause: error })
    }

    if (response === undefined) {
      return new ApiError('network', defaultMessages.network, { code, cause: error })
    }

    return new ApiError('http', `${defaultMessages.http}（${response.status}）`, {
      status: response.status,
      code,
      data: response.data,
      cause: error,
    })
  }

  return new ApiError('unknown', error instanceof Error ? error.message : defaultMessages.unknown, {
    cause: error,
  })
}
