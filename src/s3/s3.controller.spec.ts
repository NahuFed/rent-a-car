import { Test, TestingModule } from '@nestjs/testing';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';
import { DocumentService } from 'src/document/document.service';
import { PictureService } from 'src/picture/picture.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('S3Controller', () => {
  let controller: S3Controller;
  let s3Service: Partial<S3Service>;
  let documentService: Partial<DocumentService>;
  let pictureService: Partial<PictureService>;

  beforeEach(async () => {
    s3Service = {
      uploadFile: jest.fn(),
      getPresignedUrl: jest.fn(),
      deleteFile: jest.fn(),
      getFiles: jest.fn(),
    };

    documentService = {
      create: jest.fn(),
    };

    pictureService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [S3Controller],
      providers: [
        { provide: S3Service, useValue: s3Service },
        { provide: DocumentService, useValue: documentService },
        { provide: PictureService, useValue: pictureService },
      ],
    }).compile();

    controller = module.get<S3Controller>(S3Controller);
  });

  describe('uploadDocument', () => {
    it('should throw error if file is not provided', async () => {
      const req = { user: { id: 1 } };
      const createDocumentDto = {
        title: 'Test Document',
        url: '',
        src: '',
        description: 'Description',
      };
      await expect(
        controller.uploadDocument(null as unknown as Express.Multer.File, req, createDocumentDto),
      ).rejects.toThrow(new HttpException('no file provided', HttpStatus.BAD_REQUEST));
    });

    it('should create a new document and return it with a presigned url', async () => {
      const file = {
        path: 'uploads/documents/tmpfile.jpg',
        filename: 'tmpfile.jpg',
        mimetype: 'image/jpeg',
      } as Express.Multer.File;
      const req = { user: { id: 1 } };
      const createDocumentDto = {
        title: 'Test Document',
        url: 'http://test.com/document.jpg',
        src: '',
        description: 'Description',
      };

      (s3Service.uploadFile as jest.Mock).mockResolvedValue('http://s3bucket/my-local-bucket/documents/tmpfile.jpg');
      const createdDocument = {
        id: 1,
        ...createDocumentDto,
        url: 'http://s3bucket/my-local-bucket/documents/tmpfile.jpg',
        src: `documents/${file.filename}`,
      };
      (documentService.create as jest.Mock).mockResolvedValue(createdDocument);
      (s3Service.getPresignedUrl as jest.Mock).mockResolvedValue('http://signedurl.com/doc');

      const result = await controller.uploadDocument(file, req, createDocumentDto);
      expect(s3Service.uploadFile).toHaveBeenCalledWith(
        file.path,
        file.filename,
        file.mimetype,
        'documents',
      );
      expect(documentService.create).toHaveBeenCalledWith(
        {
          ...createDocumentDto,
          url: 'http://s3bucket/my-local-bucket/documents/tmpfile.jpg',
          src: `documents/${file.filename}`,
        },
        req.user.id,
      );
      expect(s3Service.getPresignedUrl).toHaveBeenCalledWith(createdDocument.src);
      expect(result).toEqual({ ...createdDocument, url: 'http://signedurl.com/doc' });
    });
  });

  describe('uploadCarImage', () => {
    it('should throw error if file is not provided', async () => {
      const req = { user: { id: 1 } };
      await expect(
        controller.uploadCarImage(null as unknown as Express.Multer.File, req),
      ).rejects.toThrow(new HttpException('no file provided', HttpStatus.BAD_REQUEST));
    });

    it('should upload car image and return url', async () => {
      const file = {
        path: 'uploads/cars/tmpfile.jpg',
        filename: 'tmpfile.jpg',
        mimetype: 'image/jpeg',
      } as Express.Multer.File;
      const req = { user: { id: 1 } };

      (s3Service.uploadFile as jest.Mock).mockResolvedValue('http://s3bucket/my-local-bucket/cars/tmpfile.jpg');

      const result = await controller.uploadCarImage(file, req);
      expect(s3Service.uploadFile).toHaveBeenCalledWith(
        file.path,
        file.filename,
        file.mimetype,
        'cars',
      );
      expect(result).toEqual({ url: 'http://s3bucket/my-local-bucket/cars/tmpfile.jpg' });
    });
  });

  describe('deleteFile', () => {
    it('should delete a file and return confirmation message', async () => {
      const key = 'documents/tmpfile.jpg';
      (s3Service.deleteFile as jest.Mock).mockResolvedValue(undefined);

      const result = await controller.deleteFile(key);
      expect(s3Service.deleteFile).toHaveBeenCalledWith(key);
      expect(result).toEqual({ message: 'file deleted' });
    });
  });

  describe('getFiles', () => {
    it('should return a list of files', async () => {
      const files = [{ Key: 'documents/tmpfile.jpg' }, { Key: 'cars/car1.jpg' }];
      (s3Service.getFiles as jest.Mock).mockResolvedValue(files);

      const result = await controller.getFiles();
      expect(s3Service.getFiles).toHaveBeenCalled();
      expect(result).toEqual(files);
    });
  });
});

