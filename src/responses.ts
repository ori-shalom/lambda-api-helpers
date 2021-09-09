/**
 * Use in top level handler to convert errors to a normalized HTTP response.
 * @param error
 * @returns {{statusCode: number, body: string}}
 */
import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda/trigger/api-gateway-proxy';
import { JsonObject } from 'type-fest';

export function catchError(error: any): { statusCode: number, body: string} {
  console.error(error);
  const { name = 'Server Error', status, message, stack } = error;
  return {
    statusCode: status ?? 500,
    body: JSON.stringify(process.env.NODE_ENV === 'production' ? { name, message } : { name, message, stack })
  }
}

/**
 * Use in top level handler to convert successful response to a normalized HTTP response.
 * @param response
 * @return {{body: string, statusCode: number} | {statusCode: number}}
 */
export function success(response?: JsonObject | Buffer | void): APIGatewayProxyStructuredResultV2 {
  return (response === undefined || response === null ? {
    statusCode: 204
  } : {
    statusCode: 200,
    isBase64Encoded: Buffer.isBuffer(response),
    body: Buffer.isBuffer(response) ? response.toString('base64') : JSON.stringify(response)
  });
}


/**
 * Centralized custom error object that derives from Node’s Error
 * General HTTP Errors : see https://httpstatuses.com/
 */
export abstract class HttpError extends Error {
  protected constructor(
    public readonly name: string,
    public readonly status: number = 500,
    message?: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    Error.captureStackTrace(this);
  }
}

/**
 * 400 - Bad Request
 *
 * The server could not understand the request.
 * Can happen when request failed validation or received in a malformed format.
 */
export class BadRequest extends HttpError {
  constructor(message?: string) {
    super('Bad Request', 400, message);
  }
}


/**
 * 401 - Unauthorized
 *
 * Request has not been applied because it lacks valid authentication credentials.
 * Can happen when the Authorization token is expired, invalid or missing.
 */
export class Unauthorized extends HttpError {
  constructor(message?: string) {
    super('Unauthorized', 401, message);
  }
}

/**
 * 403 - Forbidden
 *
 * The server understood the request but authenticated user isn't authorized to perform it.
 * Happens when the user don't have sufficient permissions to perform the request.
 */
export class Forbidden extends HttpError {
  constructor(message?: string) {
    super('Forbidden', 403, message);
  }
}

/**
 * 404 - Not Found
 *
 * The requested resource has not been found.
 * Can happen when querying resource with wrong id or resource that has been deleted.
 */
export class NotFound extends HttpError {
  constructor(message?: string) {
    super('Not Found', 404, message);
  }
}

/**
 * 409 - Conflict
 *
 * The server can not process your request due a conflict with a existing result.
 * Might happen when trying to create a resource which already exist.
 */
export class Conflict extends HttpError {
  constructor(message?: string) {
    super('Conflict', 409, message);
  }
}

/**
 * 429 - Too Many Requests
 *
 * The user has sent too many requests in a given amount of time.
 * Might happen when there is a throttling policy applied.
 */
export class TooManyRequests extends HttpError {
  constructor(message?: string) {
    super('Too Many Requests', 429, message)
  }
}

