import { Test, TestingModule } from '@nestjs/testing';
import { RentController } from './rent.controller';
import { RentService } from './rent.service';
import { Role, RoleType } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';

describe('RentController', () => {
  let controller: RentController;
  let rentService: Partial<RentService>;

  beforeEach(async () => {
    rentService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByUser: jest.fn(),
      findByCar: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      cancelRent: jest.fn(),
      findRentsByStatus: jest.fn(),
      listRentRequests: jest.fn(),
      admitRentRequest: jest.fn(),
      rejectRentRequest: jest.fn(),
      getUserRentHistory: jest.fn(),
      getAllRentHistory: jest.fn(),
      getUnavailableDates: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentController],
      providers: [{ provide: RentService, useValue: rentService }],
    }).compile();

    controller = module.get<RentController>(RentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call rentService.create with createRentDto and return its value', async () => {
      const createRentDto = { 
        carId: 1, 
        pricePerDay: 50, // propiedad agregada
        userId: 1, 
        startingDate: new Date(), 
        dueDate: new Date() 
      };
      const expectedResult = { id: 1, ...createRentDto };
      (rentService.create as jest.Mock).mockResolvedValue(expectedResult);
  
      const result = await controller.create(createRentDto);
      expect(rentService.create).toHaveBeenCalledWith(createRentDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all rents', async () => {
      const expectedResult = [{ id: 1 }, { id: 2 }];
      (rentService.findAll as jest.Mock).mockResolvedValue(expectedResult);
  
      const result = await controller.findAll();
      expect(rentService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return one rent by id', async () => {
      const rent = { id: 1 };
      (rentService.findOne as jest.Mock).mockResolvedValue(rent);
  
      const result = await controller.findOne('1');
      expect(rentService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(rent);
    });
  });

  describe('findByUser', () => {
    it('should return rents for a specific user', async () => {
      const rents = [{ id: 1 }, { id: 2 }];
      (rentService.findByUser as jest.Mock).mockResolvedValue(rents);
  
      const result = await controller.findByUser('1');
      expect(rentService.findByUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(rents);
    });
  });

  describe('findByCar', () => {
    it('should return rents for a specific car', async () => {
      const rents = [{ id: 1 }];
      (rentService.findByCar as jest.Mock).mockResolvedValue(rents);
  
      const result = await controller.findByCar('1');
      expect(rentService.findByCar).toHaveBeenCalledWith(1);
      expect(result).toEqual(rents);
    });
  });

  describe('update', () => {
    it('should update a rent and return the updated object', async () => {
      const updateRentDto = { carId: 2, pricePerDay: 100 };
      const expectedResult = { id: 1, ...updateRentDto };
      (rentService.update as jest.Mock).mockResolvedValue(expectedResult);
  
      const result = await controller.update('1', updateRentDto);
      expect(rentService.update).toHaveBeenCalledWith(1, updateRentDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a rent and return removal info', async () => {
      const expectedResult = { affected: 1 };
      (rentService.remove as jest.Mock).mockResolvedValue(expectedResult);
  
      const result = await controller.remove('1');
      expect(rentService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('cancelRent', () => {
    it('should cancel a rent and return cancellation info', async () => {
      const expectedResult = { canceled: true };
      (rentService.cancelRent as jest.Mock).mockResolvedValue(expectedResult);
  
      const result = await controller.cancelRent('1');
      expect(rentService.cancelRent).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findRentsByStatus', () => {
    it('should return rents by a given status', async () => {
      const expectedResult = [{ id: 1 }];
      (rentService.findRentsByStatus as jest.Mock).mockResolvedValue(expectedResult);
  
      const result = await controller.findRentsByStatus('active');
      expect(rentService.findRentsByStatus).toHaveBeenCalledWith('active');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('listRentRequests', () => {
    it('should list rent requests', async () => {
      const expectedResult = [{ id: 1 }];
      (rentService.listRentRequests as jest.Mock).mockResolvedValue(expectedResult);
  
      const result = await controller.listRentRequests();
      expect(rentService.listRentRequests).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('admitRentRequest', () => {
    it('should admit a rent request and return its result', async () => {
      const admin: User = {
        id: 1,
        firstName: 'Admin',
        lastName: 'User',
        dob: new Date(),
        email: 'admin@example.com',
        address: 'Admin Address',
        country: 'Adminland',
        role: { name: RoleType.ADMIN } as Role,
        documents: [],
        rents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const expectedResult = { admitted: true };
      (rentService.admitRentRequest as jest.Mock).mockResolvedValue(expectedResult);
  
      const result = await controller.admitRentRequest(1, admin);
      expect(rentService.admitRentRequest).toHaveBeenCalledWith(1, admin);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('rejectRentRequest', () => {
    it('should reject a rent request and return its result', async () => {
      const admin: User = {
        id: 1,
        firstName: 'Admin',
        lastName: 'User',
        dob: new Date(),
        email: 'admin@example.com',
        address: 'Admin Address',
        country: 'Adminland',
        role: { name: RoleType.ADMIN } as Role,
        documents: [],
        rents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const expectedResult = { rejected: true };
      (rentService.rejectRentRequest as jest.Mock).mockResolvedValue(expectedResult);
  
      const result = await controller.rejectRentRequest(1, admin);
      expect(rentService.rejectRentRequest).toHaveBeenCalledWith(1, admin);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getUserRentHistory', () => {
    it('should return rent history for a specific user', async () => {
      const expectedResult = [{ id: 1 }];
      (rentService.getUserRentHistory as jest.Mock).mockResolvedValue(expectedResult);
  
      const result = await controller.getUserRentHistory('1');
      expect(rentService.getUserRentHistory).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAllRentHistory', () => {
    it('should return all rent history', async () => {
      const expectedResult = [{ id: 1 }];
      (rentService.getAllRentHistory as jest.Mock).mockResolvedValue(expectedResult);
  
      const result = await controller.getAllRentHistory();
      expect(rentService.getAllRentHistory).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAvailability', () => {
    it('should return unavailable dates for a given car', async () => {
      const unavailableDates = [new Date('2025-01-01'), new Date('2025-01-02')];
      (rentService.getUnavailableDates as jest.Mock).mockResolvedValue(unavailableDates);
  
      const result = await controller.getAvailability('1');
      expect(rentService.getUnavailableDates).toHaveBeenCalledWith(1);
      expect(result).toEqual({ unavailableDates });
    });
  });
});
