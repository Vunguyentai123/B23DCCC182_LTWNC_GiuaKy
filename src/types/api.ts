export interface ApiSuccess<TData> {
  ok: true;
  data: TData;
}

export interface ApiFailure {
  ok: false;
  error: string;
}

export type ApiResult<TData> = ApiSuccess<TData> | ApiFailure;

export function isApiSuccess<TData>(result: ApiResult<TData>): result is ApiSuccess<TData> {
  return result.ok === true;
}

export function isApiFailure<TData>(result: ApiResult<TData>): result is ApiFailure {
  return result.ok === false;
}
