import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from './document/document.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { DocumentController } from './document/document.controller';
import { DocumentService } from './document/document.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { EmailModule } from './email/email.module';
import { CarModule } from './car/car.module';
import { PictureModule } from './picture/picture.module';
import { CarPictureModule } from './car-picture/car-picture.module';
import { RentModule } from './rent/rent.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'rent_a_car',
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}', User],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
    }),
    UserModule,
    DocumentModule,
    RoleModule,
    RoleModule,
    AuthModule,
    EmailModule,
    CarModule,
    PictureModule,
    CarPictureModule,
    RentModule,
    S3Module,
  ],
  controllers: [
    AppController,
    UserController,
    DocumentController,
    RoleController,
  ],
  providers: [AppService, DocumentService, RoleService, UserService],
})
export class AppModule {}
