import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Role, RoleType } from 'src/role/entities/role.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            getUsers: jest.fn(),
            getUser: jest.fn(),
            deleteUser: jest.fn(),
            updateUser: jest.fn(),
            getUserByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      dob: new Date('1990-01-01'),
      email: 'john@doe.com',
      address: '123 Main St',
      country: 'USA',
      role: { name: RoleType.USER } as Role,
    };

    const createdUser = {
      ...createUserDto,
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: { name: createUserDto.role.name } as Role,
      documents: [],
      rents: [],
    } as User;

    jest.spyOn(service, 'create').mockResolvedValue(createdUser);

    expect(await controller.create(createUserDto)).toEqual(createdUser);
  });

  it('should get all users', async () => {
    const users = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        dob: new Date('1990-01-01'),
        email: 'john@doe.com',
        address: '123 Main St',
        country: 'USA',
        role: { name: 'user' } as Role,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as User[];

    jest.spyOn(service, 'getUsers').mockResolvedValue(users);

    expect(await controller.getUsers()).toEqual(users);
  });

  it('should get a user by id', async () => {
    const user = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dob: new Date('1990-01-01'),
      email: 'john@doe.com',
      address: '123 Main St',
      country: 'USA',
      role: { name: 'user' } as Role,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    jest.spyOn(service, 'getUser').mockResolvedValue(user);

    expect(await controller.getUser(1)).toEqual(user);
  });

  it('should throw NotFoundException for non-existent user', async () => {
    jest.spyOn(service, 'getUser').mockResolvedValue(null);
    await expect(controller.getUser(999)).rejects.toThrow(NotFoundException);
  });

  it('should delete a user', async () => {
    jest.spyOn(service, 'deleteUser').mockResolvedValue({ affected: 1 } as any);
    expect(await controller.deleteUser(1)).toEqual({ affected: 1 });
  });

  describe('updateUser', () => {
    it('should update a user when ids match', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        dob: new Date('1990-01-01'),
        address: '123 Main St',
        country: 'USA',
        roleName: 'user',
      };

      const req = { user: { id: 1 } };
      jest.spyOn(service, 'updateUser').mockResolvedValue({ affected: 1 } as any);

      expect(await controller.updateUser(1, updateUserDto, req)).toEqual({ affected: 1 });
    });

    it('should throw UnauthorizedException when ids do not match', () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        dob: new Date('1990-01-01'),
        address: '123 Main St',
        country: 'USA',
        roleName: 'user',
      };

      const req = { user: { id: 2 } };

      expect(() => controller.updateUser(1, updateUserDto, req)).toThrowError(
        'Not authorized to update another user',
      );
    });
  });

  it('should update a user by admin via adminUpdateUser', async () => {
    const updateUserDto: UpdateUserDto = {
      firstName: 'Admin Updated',
      lastName: 'User',
      dob: new Date('1990-01-01'),
      address: '123 Main St',
      country: 'USA',
      roleName: 'user',
    };

    jest.spyOn(service, 'updateUser').mockResolvedValue({ affected: 1 } as any);
    expect(await controller.adminUpdateUser(1, updateUserDto)).toEqual({
      affected: 1,
    });
  });

  it('should get user by email', async () => {
    const user = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dob: new Date('1990-01-01'),
      email: 'john@doe.com',
      address: '123 Main St',
      country: 'USA',
      role: { name: 'user' } as Role,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    jest.spyOn(service, 'getUserByEmail').mockResolvedValue(user);

    expect(await controller.getUserByEmail('john@doe.com')).toEqual(user);
  });

  it('should throw NotFoundException when email not found', async () => {
    jest.spyOn(service, 'getUserByEmail').mockResolvedValue(null);
    await expect(controller.getUserByEmail('notfound@example.com')).rejects.toThrow(NotFoundException);
  });
});
