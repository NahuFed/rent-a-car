import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from './document/document.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '1234',
    database: 'rent_a_car',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),UserModule, DocumentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
