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

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '1234',
    database: 'rent_a_car',
    autoLoadEntities: true,
    entities: [__dirname + '/**/*.entity{.ts,.js}',User],
    synchronize: true,
  }), ConfigModule.forRoot({
    envFilePath: '.development.env',
    isGlobal: true,
  }), UserModule,DocumentModule, RoleModule,RoleModule, AuthModule],
  controllers: [AppController,UserController,DocumentController,RoleController],
  providers: [AppService,DocumentService,RoleService,UserService],
})
export class AppModule {}
