import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { applicationExceptionMap } from './application-exception.mapper';

@Catch()
export class ApplicationExceptionFilter implements ExceptionFilter {

    catch(exception: Error, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();

        const status = applicationExceptionMap.get(exception.constructor) ?? HttpStatus.INTERNAL_SERVER_ERROR;

        response.status(status).json({
            statusCode: status,
            message: exception.message,
            error: exception.name
        });
    }
}