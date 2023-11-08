import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        //entities: [__dirname + '\\**\\entities\\*.entity{.ts,.js}'], //[__dirname + '/**/*.entity{.ts,.js}'
        // extra: (process.env?.DB_TLS_SSL && process.env?.DB_TLS_SSL === 'true') ? { "ssl": "true" } : {},       
        synchronize: false,
        autoLoadEntities:true
      }),
      inject: [ConfigService],
    }),
    AuthModule
  ],
  providers:[
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    JwtService
  ]
})
export class AppModule {}
