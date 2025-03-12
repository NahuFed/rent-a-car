import { Module, forwardRef } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { DocumentModule } from 'src/document/document.module';
import { PictureModule } from 'src/picture/picture.module';

@Module({
  imports: [forwardRef(() => DocumentModule), forwardRef(()=> PictureModule) ], 
  controllers: [S3Controller],
  providers: [S3Service],
  exports: [S3Service], 
})
export class S3Module {}
