import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda/trigger/api-gateway-proxy';
import { BadRequest, catchError, success } from './responses';
import { assertHttpMethod, SimpleHandler, MethodHandlers } from './types';

export * from './responses';
export * from './types';
export * from 'aws-lambda';

export default function asLambdaHandler(handler: SimpleHandler | MethodHandlers): APIGatewayProxyHandlerV2 {
  return async (event: APIGatewayProxyEventV2) => {
    const method = assertHttpMethod(event.requestContext.http.method);
    const api = typeof handler === 'function' ? handler : handler[method] ?? (() => { throw new BadRequest(); });
    return api({
      method,
      body: event.body ? JSON.parse(event.body) : undefined,
      queryParams: event.queryStringParameters ?? {},
      pathParams: event.pathParameters ?? {},
      headers: event.headers
    }).then(success).catch(catchError);
  }
}
