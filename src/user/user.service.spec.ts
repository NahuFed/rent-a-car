import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/role/entities/role.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      dob: new Date('1990-01-01'),
      address: '123 Main St',
      country: 'USA',
      roleName: 'user',
    };

    const createdUser = {
      ...createUserDto,
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: {  name: 'user' } as Role,
      documents: [],
    } as User;

    jest.spyOn(repository, 'create').mockReturnValue(createdUser);
    jest.spyOn(repository, 'save').mockResolvedValue(createdUser);

    expect(await service.create(createUserDto)).toEqual(createdUser);
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = {
      firstName: 'Jane',
      lastName: 'Doe',
      dob: new Date('1990-01-01'),
      address: '123 Main St',
      country: 'USA',
      roleName: 'user',
    };

    const user = {
      ...updateUserDto,
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    jest.spyOn(repository, 'findOne').mockResolvedValue(user);
    jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1 } as any);

    expect(await service.updateUser(1, updateUserDto)).toEqual({ affected: 1 });
  });

  it('should delete a user', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

    expect(await service.deleteUser(1)).toEqual({ affected: 1 });
  });

  it('should get a user by id', async () => {
    const user = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dob: new Date('1990-01-01'),
      address: '123 Main St',
      country: 'USA',
      role: {  name: 'user' } as Role,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    jest.spyOn(repository, 'findOne').mockResolvedValue(user);

    expect(await service.getUser(1)).toEqual(user);
  });

  it('should get all users', async () => {
    const users = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        dob: new Date('1990-01-01'),
        address: '123 Main St',
        country: 'USA',
        role: {  name: 'user' } as Role,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as User[];

    jest.spyOn(repository, 'find').mockResolvedValue(users);

    expect(await service.getUsers()).toEqual(users);
  });
});
