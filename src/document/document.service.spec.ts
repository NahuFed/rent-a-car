import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { User } from 'src/user/entities/user.entity';

const fakeRepo = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('DocumentService', () => {
  let service: DocumentService;
  let documentRepository;
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(Document),
          useValue: fakeRepo(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: fakeRepo(),
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    documentRepository = module.get(getRepositoryToken(Document));
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new document', async () => {
      const createDocumentDto = { 
        title: 'Test Document', 
        url: 'http://test.com/document.jpg',
        src: 'documents/document.jpg',
        description: 'Test Description'
      };
      const userId = 1;
      const user = { id: userId } as User;

      userRepository.findOne.mockResolvedValue(user);
      documentRepository.create.mockReturnValue({ ...createDocumentDto, user });
      documentRepository.save.mockResolvedValue({ id: 1, ...createDocumentDto, user });

      const result = await service.create(createDocumentDto, userId);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(documentRepository.create).toHaveBeenCalledWith({ ...createDocumentDto, user });
      expect(documentRepository.save).toHaveBeenCalledWith({ ...createDocumentDto, user });
      expect(result).toEqual({ id: 1, ...createDocumentDto, user });
    });

    it('should throw an error if user is not found', async () => {
      const createDocumentDto = { 
        title: 'Test Document', 
        url: 'http://test.com/document.jpg',
        src: 'documents/document.jpg', 
        description: 'Test Description'
      };
      const userId = 1;

      userRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDocumentDto, userId)).rejects.toThrow('User not found');
    });
  });

  describe('findAll', () => {
    it('should return all documents with user relation', async () => {
      const documents = [{ id: 1, title: 'Test Document', content: 'Test Content' }];
      documentRepository.find.mockResolvedValue(documents);

      const result = await service.findAll();

      expect(documentRepository.find).toHaveBeenCalledWith({ relations: ['user'] });
      expect(result).toEqual(documents);
    });
  });

  describe('findOne', () => {
    it('should return a document by id with user relation', async () => {
      const doc = { id: 1, title: 'Test Document', content: 'Test Content' };
      documentRepository.findOne.mockResolvedValue(doc);

      const result = await service.findOne(1);

      expect(documentRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['user'] });
      expect(result).toEqual(doc);
    });
  });

  describe('update', () => {
    it('should update a document with new updatedAt date', async () => {
      const updateDocumentDto = { title: 'Updated Document', content: 'Updated Content' };
      // Simulate repository update returns an UpdateResult (o similar)
      const updateResult = { affected: 1 };
      documentRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(1, updateDocumentDto);

      expect(documentRepository.update).toHaveBeenCalledWith(1, { 
        ...updateDocumentDto, 
        updatedAt: expect.any(Date) 
      });
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove a document', async () => {
      const deleteResult = { affected: 1 };
      documentRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(1);

      expect(documentRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleteResult);
    });
  });

  describe('findUserDocuments', () => {
    it('should return documents for a user with ordering and relations', async () => {
      const userId = 1;
      const documents = [{ id: 1, title: 'Test Document', content: 'Test Content' }];
      documentRepository.find.mockResolvedValue(documents);

      const result = await service.findUserDocuments(userId);

      expect(documentRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(documents);
    });
  });
});
