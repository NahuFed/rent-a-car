import { Test, TestingModule } from '@nestjs/testing';
import { PictureController } from './picture.controller';
import { PictureService } from './picture.service';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { CarPictureType } from 'src/car-picture/entities/car-picture.entity';

const mockPictureService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findByCar: jest.fn(),
};

describe('PictureController', () => {
  let controller: PictureController;
  let service: PictureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PictureController],
      providers: [
        {
          provide: PictureService,
          useValue: mockPictureService,
        },
      ],
    }).compile();

    controller = module.get<PictureController>(PictureController);
    service = module.get<PictureService>(PictureService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      mockPictureService.create.mockResolvedValue(result);

      expect(await controller.create(createPictureDto)).toEqual(result);
      expect(mockPictureService.create).toHaveBeenCalledWith(createPictureDto);
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

      mockPictureService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockPictureService.findAll).toHaveBeenCalled();
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

      mockPictureService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(mockPictureService.findOne).toHaveBeenCalledWith(1);
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
      };

      mockPictureService.update.mockResolvedValue(result);

      expect(await controller.update('1', updatePictureDto)).toEqual(result);
      expect(mockPictureService.update).toHaveBeenCalledWith(1, updatePictureDto);
    });
  });

  describe('remove', () => {
    it('should remove a picture', async () => {
      const result = { affected: 1 };

      mockPictureService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
      expect(mockPictureService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findPicturesByCar', () => {
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

      mockPictureService.findByCar.mockResolvedValue(result);

      expect(await controller.findPicturesByCar(1, CarPictureType.FRONT)).toEqual(result);
      expect(mockPictureService.findByCar).toHaveBeenCalledWith(1, CarPictureType.FRONT);
    });
  });
});