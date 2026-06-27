import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let errors: Array<{ field?: string; message: string }> = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp.message as string) || message;
        error = (resp.error as string) || error;
        if (Array.isArray(resp.errors)) {
          errors = resp.errors as Array<{ field?: string; message: string }>;
        }
      }

      error = HttpStatus[status] || error;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
