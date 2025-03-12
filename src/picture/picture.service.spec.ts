import { Test, TestingModule } from '@nestjs/testing';
import { PictureService } from './picture.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Picture } from './entities/picture.entity';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { CarPictureType } from 'src/car-picture/entities/car-picture.entity';
import { NotFoundException } from '@nestjs/common';

const mockPictureRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  }),
};

describe('PictureService', () => {
  let service: PictureService;
  let repository: Repository<Picture>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PictureService,
        {
          provide: getRepositoryToken(Picture),
          useValue: mockPictureRepository,
        },
      ],
    }).compile();

    service = module.get<PictureService>(PictureService);
    repository = module.get<Repository<Picture>>(getRepositoryToken(Picture));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new picture', async () => {
      const createPictureDto: CreatePictureDto = {
        car: { id: 1 } as any,
        src: 'https://example.com/image.jpg',
        description: 'Imagen frontal del coche',
        title: 'Frontal',
        type: { name: CarPictureType.FRONT } as any,
        date: new Date(),
      };

      const result = {
        id: 1,
        ...createPictureDto,
      };

      mockPictureRepository.create.mockReturnValue(createPictureDto);
      mockPictureRepository.save.mockResolvedValue(result);

      expect(await service.create(createPictureDto)).toEqual(result);
      expect(mockPictureRepository.create).toHaveBeenCalledWith(createPictureDto);
      expect(mockPictureRepository.save).toHaveBeenCalledWith(createPictureDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of pictures', async () => {
      const result = [
        {
          id: 1,
          car: { id: 1 } as any,
          src: 'https://example.com/image.jpg',
          description: 'Imagen frontal del coche',
          title: 'Frontal',
          type: { name: CarPictureType.FRONT } as any,
          date: new Date(),
        },
      ];

      mockPictureRepository.find.mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
      expect(mockPictureRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single picture', async () => {
      const result = {
        id: 1,
        car: { id: 1 } as any,
        src: 'https://example.com/image.jpg',
        description: 'Imagen frontal del coche',
        title: 'Frontal',
        type: { name: CarPictureType.FRONT } as any,
        date: new Date(),
      };

      mockPictureRepository.findOne.mockResolvedValue(result);

      expect(await service.findOne(1)).toEqual(result);
      expect(mockPictureRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update a picture', async () => {
      const updatePictureDto: UpdatePictureDto = {
        src: 'https://example.com/image-updated.jpg',
        description: 'Imagen frontal del coche actualizada',
        title: 'Frontal Actualizado',
        date: new Date(),
      };

      const result = {
        id: 1,
        ...updatePictureDto,
        updatedAt: new Date(),
      };

      mockPictureRepository.update.mockResolvedValue(result);
      mockPictureRepository.findOne.mockResolvedValue(result);

      expect(await service.update(1, updatePictureDto)).toEqual(result);
      expect(mockPictureRepository.update).toHaveBeenCalledWith(1, {
        ...updatePictureDto,
        updatedAt: expect.any(Date),
      });
      expect(mockPictureRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw an error if the picture is not found', async () => {
      const updatePictureDto: UpdatePictureDto = {
        src: 'https://example.com/image-updated.jpg',
        description: 'Imagen frontal del coche actualizada',
        title: 'Frontal Actualizado',
        date: new Date(),
      };

      mockPictureRepository.update.mockResolvedValue(null);
      mockPictureRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, updatePictureDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPictureRepository.update).toHaveBeenCalledWith(1, {
        ...updatePictureDto,
        updatedAt: expect.any(Date),
      });
      expect(mockPictureRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('remove', () => {
    it('should remove a picture', async () => {
      const result = { affected: 1 };

      mockPictureRepository.delete.mockResolvedValue(result);

      expect(await service.remove(1)).toEqual(result);
      expect(mockPictureRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('findByCar', () => {
    it('should return an array of pictures for a specific car', async () => {
      const result = [
        {
          id: 1,
          car: { id: 1 } as any,
          src: 'https://example.com/image.jpg',
          description: 'Imagen frontal del coche',
          title: 'Frontal',
          type: { name: CarPictureType.FRONT } as any,
          date: new Date(),
        },
      ];

      mockPictureRepository.createQueryBuilder().getMany.mockResolvedValue(result);

      expect(await service.findByCar(1)).toEqual(result);
      expect(mockPictureRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockPictureRepository.createQueryBuilder().where).toHaveBeenCalledWith('picture.carId = :carId', { carId: 1 });
    });
  });
});