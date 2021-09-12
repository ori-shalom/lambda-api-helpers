import type { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { catchError, success } from './responses';
import { Api, assertHttpMethod } from './types';

export * from './responses';
export * from './types';

export default function asLambdaHandler(api: Api): APIGatewayProxyHandlerV2 {
  return async (event: APIGatewayProxyEventV2) => {
    return api({
      method: assertHttpMethod(event.requestContext.http.method),
      body: event.body ? JSON.parse(event.body) : undefined,
      queryParams: event.queryStringParameters ?? {},
      pathParams: event.pathParameters ?? {},
      headers: event.headers
    }).then(success).catch(catchError);
  }
}
