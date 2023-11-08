import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import * as fs from 'fs';

async function bootstrap() {
  const logger = new Logger('NestBootstrap');
  const crPath = process.env.CERT
  const pkPath = process.env.KEY
  const options: any = {};
  // validamos si los archivos existen
  if (fs.existsSync(crPath) && fs.existsSync(pkPath)) {
    // cargamos los archivos sobre las options
    logger.log(`Carga con certificados`)
    options.httpsOptions = {
      cert: fs.readFileSync(crPath),
      key: fs.readFileSync(pkPath)
    }
  }
  const app = await NestFactory.create(AppModule,options);
  app.enableCors();
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter)); // order matters
  app.setGlobalPrefix('api/v1'); 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Basic microservice')
    .setDescription('This microservice handle basic project information, so this save and search information')
    .setVersion('1.0')
    .addBearerAuth(
      { 
        // I was also testing it without prefix 'Bearer ' before the JWT
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
        scheme: 'Bearer',
        type: 'http', // I`ve attempted type: 'apiKey' too
        in: 'Header'
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const configService = app.get<ConfigService>(ConfigService);
  await app.listen(+configService.get("PORT"));
  logger.log(`Listen on port ${configService.get("PORT")}`)
}
bootstrap();
