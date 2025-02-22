import { Test, TestingModule } from '@nestjs/testing';
import { CarService } from './car.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

const mockCarRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CarService', () => {
  let service: CarService;
  let repository: Repository<Car>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        {
          provide: getRepositoryToken(Car),
          useValue: mockCarRepository,
        },
      ],
    }).compile();

    service = module.get<CarService>(CarService);
    repository = module.get<Repository<Car>>(getRepositoryToken(Car));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      mockCarRepository.create.mockReturnValue(createCarDto);
      mockCarRepository.save.mockResolvedValue(createCarDto);

      const result = await service.create(createCarDto);
      expect(result).toEqual(createCarDto);
      expect(mockCarRepository.create).toHaveBeenCalledWith(createCarDto);
      expect(mockCarRepository.save).toHaveBeenCalledWith(createCarDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of cars', async () => {
      const cars = [
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

      mockCarRepository.find.mockResolvedValue(cars);

      const result = await service.findAll();
      expect(result).toEqual(cars);
      expect(mockCarRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single car', async () => {
      const car = {
        id: 1,
        brand: 'Toyota',
        model: 'Corolla',
        color: 'Red',
        passengers: 5,
        ac: true,
        princePerDay: 50,
      };

      mockCarRepository.findOne.mockResolvedValue(car);

      const result = await service.findOne(1);
      expect(result).toEqual(car);
      expect(mockCarRepository.findOne).toHaveBeenCalledWith(1);
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

      mockCarRepository.update.mockResolvedValue(updateCarDto);
      mockCarRepository.findOne.mockResolvedValue(updateCarDto);

      const result = await service.update(1, updateCarDto);
      expect(result).toEqual(updateCarDto);
      expect(mockCarRepository.update).toHaveBeenCalledWith(1, updateCarDto);
      expect(mockCarRepository.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should remove a car', async () => {
      mockCarRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
      expect(mockCarRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});