import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const logger = new Logger('GlobalExceptionFilter');
    logger.error(
      exception instanceof HttpException ? exception.getResponse() : exception,
    );
    logger.error(
      exception && typeof exception === 'object' && 'message' in exception
        ? exception.message
        : exception,
    );
    logger.error(
      exception && typeof exception === 'object' && 'stack' in exception
        ? exception.stack
        : exception,
    );

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      response: {
        message:
          exception instanceof HttpException
            ? exception.getResponse()['message']
            : 'Internal Server Error',
        error:
          exception instanceof HttpException
            ? exception.getResponse()['error']
            : 'Internal Server Error',
        statusCode: status,
      },
    });
  }
}
