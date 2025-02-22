import { Test, TestingModule } from '@nestjs/testing';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

const mockCarService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CarController', () => {
  let controller: CarController;
  let service: CarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarController],
      providers: [
        {
          provide: CarService,
          useValue: mockCarService,
        },
      ],
    }).compile();

    controller = module.get<CarController>(CarController);
    service = module.get<CarService>(CarService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new car', async () => {
      const createCarDto: CreateCarDto = {
        brand: 'Toyota',
        model: 'Corolla',
        color: 'Red',
        passengers: 5,
        ac: true,
        princePerDay: 50,
      };

      const result = {
        id: 1,
        ...createCarDto,
      };

      mockCarService.create.mockResolvedValue(result);

      expect(await controller.create(createCarDto)).toEqual(result);
      expect(mockCarService.create).toHaveBeenCalledWith(createCarDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of cars', async () => {
      const result = [
        {
          id: 1,
          brand: 'Toyota',
          model: 'Corolla',
          color: 'Red',
          passengers: 5,
          ac: true,
          princePerDay: 50,
        },
      ];

      mockCarService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockCarService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single car', async () => {
      const result = {
        id: 1,
        brand: 'Toyota',
        model: 'Corolla',
        color: 'Red',
        passengers: 5,
        ac: true,
        princePerDay: 50,
      };

      mockCarService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(mockCarService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a car', async () => {
      const updateCarDto: UpdateCarDto = {
        brand: 'Toyota',
        model: 'Corolla',
        color: 'Blue',
        passengers: 5,
        ac: true,
        princePerDay: 55,
      };

      const result = {
        id: 1,
        ...updateCarDto,
      };

      mockCarService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateCarDto)).toEqual(result);
      expect(mockCarService.update).toHaveBeenCalledWith(1, updateCarDto);
    });
  });

  describe('remove', () => {
    it('should remove a car', async () => {
      const result = { affected: 1 };

      mockCarService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
      expect(mockCarService.remove).toHaveBeenCalledWith(1);
    });
  });
});