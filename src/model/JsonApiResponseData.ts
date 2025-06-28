export interface IGenericJsonApiResponseData<T> {
  success: boolean
  version: string
  message: string
  code: number
  data: T
}

export type IJsonApiResponseData = IGenericJsonApiResponseData<
  Record<string, object> | boolean | string | number
>

export interface RateLimitedApiResultPayload {
  coolDownRemainder: number
}
