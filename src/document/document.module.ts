import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { Document } from './entities/document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), UserModule, S3Module],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService, TypeOrmModule],
})
export class DocumentModule {}
