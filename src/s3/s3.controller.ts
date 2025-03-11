import {
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  Query,
  UseInterceptors,
  Req,
  HttpException,
  HttpStatus,
  Body,
  Delete,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import { DocumentService } from 'src/document/document.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateDocumentDto } from 'src/document/dto/create-document.dto';
import { PictureService } from 'src/picture/picture.service';

@Controller('s3')
export class S3Controller {
  constructor(
    private readonly s3Service: S3Service,
    private readonly documentService: DocumentService,
    private readonly pictureService: PictureService,
  ) {}

  @Post('upload/document')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/documents',
        filename: (req, file, callback) => {
          const name = path.parse(file.originalname).name.replace(/\s/g, '');
          const fileExtName = path.extname(file.originalname);
          const fileName = `${name}-${Date.now()}${fileExtName}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Body() createDocumentDto: CreateDocumentDto,
  ) {
    if (!file) {
      throw new HttpException('no file provided', HttpStatus.BAD_REQUEST);
    }

    const user = req.user;

    const fileUrl = await this.s3Service.uploadFile(
      file.path,
      file.filename,
      file.mimetype,
      'documents',
    );

    const document = await this.documentService.create(
      {
        ...createDocumentDto,
        url: fileUrl,
        src: `documents/${file.filename}`,
      },
      user.id,
    );

    const presignedUrl = await this.s3Service.getPresignedUrl(document.src);

    return { ...document, url: presignedUrl };
  }

  @Post('upload/car')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/cars',
        filename: (req, file, callback) => {
          const name = path.parse(file.originalname).name.replace(/\s/g, '');
          const fileExtName = path.extname(file.originalname);
          const fileName = `${name}-${Date.now()}${fileExtName}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadCarImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (!file) {
      throw new HttpException('no file provided', HttpStatus.BAD_REQUEST);
    }

    const fileUrl = await this.s3Service.uploadFile(
      file.path,
      file.filename,
      file.mimetype,
      'cars',
    );

    return { url: fileUrl };
  }

  @Delete('delete')
  async deleteFile(@Query('key') key: string) {
    await this.s3Service.deleteFile(key);
    return { message: 'file deleted' };
  }

  @Get('files')
  async getFiles() {
    return await this.s3Service.getFiles();
  }
}
