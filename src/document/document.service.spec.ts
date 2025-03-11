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
    it('should return all documents', async () => {
      const documents = [{ id: 1, title: 'Test Document', content: 'Test Content' }];
      documentRepository.find.mockResolvedValue(documents);

      const result = await service.findAll();

      expect(documentRepository.find).toHaveBeenCalledWith({ relations: ['user'] });
      expect(result).toEqual(documents);
    });
  });

  describe('findOne', () => {
    it('should return a document by id', async () => {
      const document = { id: 1, title: 'Test Document', content: 'Test Content' };
      documentRepository.findOne.mockResolvedValue(document);

      const result = await service.findOne(1);

      expect(documentRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(document);
    });
  });

  describe('update', () => {
    it('should update a document', async () => {
      const updateDocumentDto = { title: 'Updated Document', content: 'Updated Content' };
      const document = { id: 1, ...updateDocumentDto, updatedAt: new Date() };

      documentRepository.update.mockResolvedValue(document);

      const result = await service.update(1, updateDocumentDto);

      expect(documentRepository.update).toHaveBeenCalledWith(1, { ...updateDocumentDto, updatedAt: expect.any(Date) });
      expect(result).toEqual(document);
    });
  });

  describe('remove', () => {
    it('should remove a document', async () => {
      documentRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(documentRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('findUserDocuments', () => {
    it('should return documents for a user', async () => {
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

  describe('findByUser', () => {
    it('should return documents by user id', async () => {
      const userId = 1;
      const documents = [{ id: 1, title: 'Test Document', content: 'Test Content' }];
      documentRepository.find.mockResolvedValue(documents);

      const result = await service.findByUser(userId);

      expect(documentRepository.find).toHaveBeenCalledWith({ where: { user: { id: userId } } });
      expect(result).toEqual(documents);
    });
  });
});
