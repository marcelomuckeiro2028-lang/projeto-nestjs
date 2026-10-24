import {
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(AllExceptionsFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    const isHttpException = exception instanceof HttpException;

    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const defaultMessage = 'Internal Server Error';
    const defaultError = 'Internal Server Error';

    let messages: string[] = [defaultMessage];
    let errorName = defaultError;

    if (isHttpException) {
      const responseData = exception.getResponse();

      if (typeof responseData === 'string') {
        messages = [responseData];
      }

      if (typeof responseData === 'object' && responseData !== null) {
        const { message, error } = responseData as Record<string, any>;

        if (Array.isArray(message)) {
          messages = message as string[];
        } else if (typeof message === 'string') {
          messages = [message];
        }

        if (typeof error === 'string') {
          errorName = error;
        }
      }
    }

    if (!isHttpException) {
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.logger.error('Erro inesperado', stack ?? String(exception));
    } else {
      this.logger.warn(`${status} - ${errorName} - ${messages.join(' | ')}`);
    }

    return response.status(status).json({
      message: messages,
      error: errorName,
      statusCode: status,
    });
  }
}
