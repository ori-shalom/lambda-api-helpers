import { JsonObject } from 'type-fest';


export type HttpMethod = 'GET' | 'HEAD' | 'PUT' | 'POST' | 'DELETE' | 'PATCH';
export type HttpBody = JsonObject | undefined;
export type HttpQueryParams = Record<string, string | undefined>;
export type HttpPathParams = Record<string, string | undefined>;
export type HttpHeaders = Record<string, string | undefined>;
export type HttpRequest = {
  method: HttpMethod
  body: HttpBody
  queryParams: HttpQueryParams
  pathParams: HttpPathParams
  headers: HttpHeaders
}
export type Api = (request: HttpRequest) => Promise<HttpBody | void>;


export function isHttpMethod(method: unknown): method is HttpMethod {
  return typeof method === 'string' && new Set(['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH']).has(method);
}
export function assertHttpMethod(method: unknown): HttpMethod {
  if (isHttpMethod(method)) return method;
  throw Error(`${method} is not a valid HTTP method`);
}
