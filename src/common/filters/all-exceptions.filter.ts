
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException
  } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorMessages } from '../enums/error-messages.enum';
import * as jwt from "jsonwebtoken";
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  
    async catch(exception: any, host: ArgumentsHost): Promise<any> {
      // In certain situations `httpAdapter` might not be available in the
      // constructor method, thus we should resolve it here.

      const { httpAdapter } = this.httpAdapterHost;
  
      const ctx = host.switchToHttp();
  
      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : exception instanceof jwt.TokenExpiredError || exception instanceof jwt.JsonWebTokenError ? 401 : 500;
 
      let requestException = {}
      let httpMessage = ErrorMessages.INTERNAL_SERVER_ERROR

      if(exception instanceof HttpException){
          const reqException = exception.getResponse();
          requestException = reqException["message"];
          httpMessage = reqException["error"];
      }
      else if(exception instanceof jwt.TokenExpiredError || exception instanceof jwt.JsonWebTokenError){
        requestException = exception.message;
        httpMessage = ErrorMessages.UNAUTHORIZED_EXCEPTION;
      }
      else{
        requestException = ErrorMessages.DEFAULT_REQUEST_EXCEPTION;
      }
      
      const responseBody = {
        statusCode: httpStatus,
        //timestamp: new Date().toISOString(),
        //path: httpAdapter.getRequestUrl(ctx.getRequest()),
        message: requestException,
        error:httpMessage
        //method:ctx.getRequest().method
      };
  
      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
  }
  