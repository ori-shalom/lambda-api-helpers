# lambda-api-helpers

Set of utilities to implement APIs using AWS Lambda.
The package provides the following features:
1. Simplify the signature of the Lambda handler
2. Error Handling & set of common HTTP errors to be used as Node JS Errors 

## 1. Simplify the signature of the Lambda handler

### Usage
```typescript
import asLambdaHandler from '@ori-sh/lambda-api';

export const handler = asLambdaHandler(async request => ({
  greeting: `Hello ${request.body?.name ?? 'World'}!`
}));
```

### Request

```typescript
type HttpRequest = {
  method: 'GET' | 'HEAD' | 'PUT' | 'POST' | 'DELETE' | 'PATCH'
  body: JsonObject | undefined
  queryParams: Record<string, string | undefined>
  pathParams: Record<string, string | undefined>
  headers: Record<string, string | undefined>
}
```

### Response

```typescript
type HttpResponse = JsonObject | undefined
```

## 2. Error Handling & set of common HTTP errors to be used as Node JS Errors

When using the `asLambdaHandler` helper it's automatically wires error handling for you.<br>
This will automatically catch any unexpected error thrown in the handler and normalize it as 500 HTTP response.

Additionally, it will catch any error extending `HttpError` and normalize it as HTTP response.

### `BadRequest` - 400
  
The server could not understand the request.
Can happen when request failed validation or received in a malformed format.

### `Unauthorized` - 401
  
Request has not been applied because it lacks valid authentication credentials.
Can happen when the Authorization token is expired, invalid or missing.

### `Forbidden` - 403
  
The server understood the request but authenticated user isn't authorized to perform it.
Happens when the user don't have sufficient permissions to perform the request.

### `NotFound` - 404
  
The requested resource has not been found.
Can happen when querying resource with wrong id or resource that has been deleted.

### `Conflict` - 409
  
The server can not process your request due a conflict with a existing result.
Might happen when trying to create a resource which already exist.

### `TooManyRequests` - 429
  
The user has sent too many requests in a given amount of time.
Might happen when there is a throttling policy applied.

> Note that the response error will expose stack traces unless explicitly setting `NODE_ENV` to `'production'`.
> Make sure to add the `NODE_ENV` environment variable in production to prevent leakage of the server internals with stack traces.

