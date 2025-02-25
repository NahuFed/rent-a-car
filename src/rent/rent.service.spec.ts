import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { RentService } from './rent.service';
import { Rent } from './entities/rent.entity';
import { User } from 'src/user/entities/user.entity';
import { Car } from 'src/car/entities/car.entity';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { IsNull, Not } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('RentService', () => {
  let service: RentService;
  let rentRepository: Repository<Rent>;
  let userRepository: Repository<User>;
  let carRepository: Repository<Car>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentService,
        {
          provide: getRepositoryToken(Rent),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Car),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RentService>(RentService);
    rentRepository = module.get<Repository<Rent>>(getRepositoryToken(Rent));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    carRepository = module.get<Repository<Car>>(getRepositoryToken(Car));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new rent', async () => {
      const createRentDto: CreateRentDto = {
        carId: 1,
        pricePerDay: 50,
        userId: 1,
        adminId: 2,
        startingDate: new Date('2025-03-01'),
        dueDate: new Date('2025-03-10'),
      };

      const user = { id: 1, role: { name: 'user' } } as User;
      const admin = { id: 2, role: { name: 'admin' } } as User;
      const car = { id: 1 } as Car;
      const rent = { id: 1, ...createRentDto, car, user, admin } as Rent;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(admin);
      jest.spyOn(carRepository, 'findOne').mockResolvedValueOnce(car);
      jest.spyOn(rentRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(rentRepository, 'create').mockReturnValue(rent);
      jest.spyOn(rentRepository, 'save').mockResolvedValueOnce(rent);

      const result = await service.create(createRentDto);
      expect(result).toEqual(rent);
    });

    it('should throw an error if the user does not exist', async () => {
      const createRentDto: CreateRentDto = {
        carId: 1,
        pricePerDay: 50,
        userId: 1,
        adminId: 2,
        startingDate: new Date('2025-03-01'),
        dueDate: new Date('2025-03-10'),
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.create(createRentDto)).rejects.toThrow(
        'The user does not exist.',
      );
    });

  });

  describe('update', () => {
    it('should update an existing rent', async () => {
      const updateRentDto: UpdateRentDto = {
        carId: 1,
        pricePerDay: 60,
        userId: 1,
        adminId: 2,
        startingDate: new Date('2025-03-01'),
        dueDate: new Date('2025-03-15'),
      };

      const user = { id: 1, role: { name: 'user' } } as User;
      const admin = { id: 2, role: { name: 'admin' } } as User;
      const car = { id: 1 } as Car;
      const rent = { id: 1, ...updateRentDto, car, user, admin } as Rent;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(admin);
      jest.spyOn(carRepository, 'findOne').mockResolvedValueOnce(car);
      jest.spyOn(rentRepository, 'findOne').mockResolvedValueOnce(rent);

      const updateResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 1,
      };

      jest.spyOn(rentRepository, 'update').mockResolvedValueOnce(updateResult);

      const result = await service.update(1, updateRentDto);
      expect(result).toEqual(updateResult);
    });

  });

  describe('extendRent', () => {
    it('should extend the due date of an existing rent', async () => {
      const rent = {
        id: 1,
        car: { id: 1 } as Car,
        startingDate: new Date('2025-03-01'),
        dueDate: new Date('2025-03-10'),
      } as Rent;

      jest.spyOn(rentRepository, 'findOne').mockResolvedValueOnce(rent);
      jest.spyOn(rentRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(rentRepository, 'save').mockResolvedValueOnce(rent);

      const newDueDate = new Date('2025-03-15');
      const result = await service.extendRent(1, newDueDate);
      expect(result.dueDate).toEqual(newDueDate);
    });

  });

  describe('cancelRent', () => {
    it('should cancel an existing rent', async () => {
      const rent = {
        id: 1,
        car: { id: 1 } as Car,
        user: { id: 1 } as User,
        admin: { id: 2 } as User,
        rejected: false,
      } as Rent;

      jest.spyOn(rentRepository, 'findOne').mockResolvedValueOnce(rent);
      jest.spyOn(rentRepository, 'save').mockResolvedValueOnce(rent);

      const result = await service.cancelRent(1);
      expect(result.rejected).toBe(true);
    });


  });

  describe('admitRentRequest', () => {
    it('should admit a rent request', async () => {
      const rent = {
        id: 1,
        car: { id: 1 } as Car,
        user: { id: 1 } as User,
        admin: { id: 2 } as User,
        rejected: false,
      } as Rent;

      jest.spyOn(rentRepository, 'findOne').mockResolvedValueOnce(rent);
      jest.spyOn(rentRepository, 'save').mockResolvedValueOnce(rent);

      const result = await service.admitRentRequest(1);
      expect(result.acceptedDated).toBeDefined();
      expect(result.rejected).toBe(false);
    });


  });

  describe('rejectRentRequest', () => {
    it('should reject a rent request', async () => {
      const rent = {
        id: 1,
        car: { id: 1 } as Car,
        user: { id: 1 } as User,
        admin: { id: 2 } as User,
        rejected: false,
      } as Rent;

      jest.spyOn(rentRepository, 'findOne').mockResolvedValueOnce(rent);
      jest.spyOn(rentRepository, 'save').mockResolvedValueOnce(rent);

      const result = await service.rejectRentRequest(1);
      expect(result.rejected).toBe(true);
    });

 
  });

  describe('findRentsByStatus', () => {
    it('should find accepted rents', async () => {
      const rents = [
        { id: 1, acceptedDated: new Date(), rejected: false } as Rent,
        { id: 2, acceptedDated: new Date(), rejected: false } as Rent,
      ];

      jest.spyOn(rentRepository, 'find').mockResolvedValueOnce(rents);

      const result = await service.findRentsByStatus('accepted');
      expect(result).toEqual(rents);
      expect(rentRepository.find).toHaveBeenCalledWith({
        where: { acceptedDated: Not(IsNull()), rejected: false },
        relations: ['car', 'user', 'admin'],
      });
    });

    it('should find pending rents', async () => {
      const rents = [
        { id: 1, acceptedDated: null, rejected: false } as Rent,
        { id: 2, acceptedDated: null, rejected: false } as Rent,
      ];

      jest.spyOn(rentRepository, 'find').mockResolvedValueOnce(rents);

      const result = await service.findRentsByStatus('pending');
      expect(result).toEqual(rents);
      expect(rentRepository.find).toHaveBeenCalledWith({
        where: { acceptedDated: IsNull(), rejected: false },
        relations: ['car', 'user', 'admin'],
      });
    });

    it('should find rejected rents', async () => {
      const rents = [
        { id: 1, rejected: true } as Rent,
        { id: 2, rejected: true } as Rent,
      ];

      jest.spyOn(rentRepository, 'find').mockResolvedValueOnce(rents);

      const result = await service.findRentsByStatus('rejected');
      expect(result).toEqual(rents);
      expect(rentRepository.find).toHaveBeenCalledWith({
        where: { rejected: true },
        relations: ['car', 'user', 'admin'],
      });
    });

    it('should throw an error for invalid status', () => {
      expect(() => service.findRentsByStatus('kljh')).toThrowError(/Invalid status/);
    });
  });


});
