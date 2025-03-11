import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { S3Service } from 'src/s3/s3.service';
import { NotFoundException } from '@nestjs/common';

describe('DocumentController', () => {
  let controller: DocumentController;
  let documentService: Partial<DocumentService>;
  let s3Service: Partial<S3Service>;

  beforeEach(async () => {
    documentService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByUser: jest.fn(),
    };

    s3Service = {
      getPresignedUrl: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        { provide: DocumentService, useValue: documentService },
        { provide: S3Service, useValue: s3Service },
      ],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
  });

  describe('create', () => {
    it('should create a new document and return it with a presigned URL', async () => {
      const createDocumentDto = {
        title: 'Test Document',
        url: 'http://test.com/document.jpg',
        src: 'documents/document.jpg',
        description: 'Test Description',
      };
      const req = { user: { id: 1 } };
      const createdDocument = { id: 1, ...createDocumentDto };
      (documentService.create as jest.Mock).mockResolvedValue(createdDocument);
      (s3Service.getPresignedUrl as jest.Mock).mockResolvedValue('http://signedurl.com/doc');

      const result = await controller.create(createDocumentDto, req);
      expect(documentService.create).toHaveBeenCalledWith(createDocumentDto, 1);
      expect(s3Service.getPresignedUrl).toHaveBeenCalledWith(createdDocument.src);
      expect(result).toEqual({ ...createdDocument, url: 'http://signedurl.com/doc' });
    });
  });

  describe('findAll', () => {
    it('should return an array of documents', async () => {
      const docs = [{ id: 1, title: 'Doc 1' }];
      (documentService.findAll as jest.Mock).mockResolvedValue(docs);
      const result = await controller.findAll();
      expect(documentService.findAll).toHaveBeenCalled();
      expect(result).toEqual(docs);
    });
  });

  describe('findOne', () => {
    it('should return a document with a presigned URL when found', async () => {
      const doc = { id: 1, src: 'documents/doc1.jpg', title: 'Doc 1' };
      (documentService.findOne as jest.Mock).mockResolvedValue(doc);
      (s3Service.getPresignedUrl as jest.Mock).mockResolvedValue('http://signedurl.com/doc1');

      const result = await controller.findOne('1');
      expect(documentService.findOne).toHaveBeenCalledWith(1);
      expect(s3Service.getPresignedUrl).toHaveBeenCalledWith(doc.src);
      expect(result).toEqual({ ...doc, url: 'http://signedurl.com/doc1' });
    });

    it('should throw a NotFoundException if the document is not found', async () => {
      (documentService.findOne as jest.Mock).mockResolvedValue(null);
      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a document', async () => {
      const updateDocumentDto = { title: 'Updated Title' };
      (documentService.update as jest.Mock).mockResolvedValue(updateDocumentDto);
      const result = await controller.update('1', updateDocumentDto);
      expect(documentService.update).toHaveBeenCalledWith(1, updateDocumentDto);
      expect(result).toEqual(updateDocumentDto);
    });
  });

  describe('remove', () => {
    it('should remove a document', async () => {
      (documentService.remove as jest.Mock).mockResolvedValue({ affected: 1 });
      const result = await controller.remove('1');
      expect(documentService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('findUserDocuments', () => {
    it('should return documents for the user with presigned URLs', async () => {
      const req = { user: { id: 1 } };
      const docs = [
        { id: 1, src: 'documents/doc1.jpg', title: 'Doc 1' },
        { id: 2, src: 'documents/doc2.jpg', title: 'Doc 2' },
      ];
      (documentService.findByUser as jest.Mock).mockResolvedValue(docs);
      (s3Service.getPresignedUrl as jest.Mock).mockImplementation((src: string) =>
        Promise.resolve(`http://signedurl.com/${src}`)
      );

      const result = await controller.findUserDocuments(req);
      expect(documentService.findByUser).toHaveBeenCalledWith(1);
      expect(s3Service.getPresignedUrl).toHaveBeenCalledTimes(docs.length);
      expect(result).toEqual(
        docs.map((doc) => ({ ...doc, url: `http://signedurl.com/${doc.src}` }))
      );
    });
  });
});
