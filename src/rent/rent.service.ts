import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, LessThan, MoreThan, IsNull, Not } from 'typeorm';
import { Rent } from './entities/rent.entity';
import { User } from 'src/user/entities/user.entity';
import { Car } from 'src/car/entities/car.entity';

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(Rent) private rentRepository: Repository<Rent>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Car) private carRepository: Repository<Car>,
  ) {}

  async create(createRentDto: CreateRentDto) {
    const { carId, userId, adminId, startingDate, dueDate } = createRentDto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });
    if (!user) {
      throw new BadRequestException('The user does not exist.');
    }

    if (user.role.name !== 'user') {
      throw new BadRequestException('The user does not have the required role.');
    }

    let admin: User | null = null;
    if (adminId !== null && adminId !== undefined) {
      admin = await this.userRepository.findOne({
        where: { id: adminId },
        relations: ['role'],
      });
      if (!admin) {
        throw new BadRequestException('The admin does not exist.');
      }
      if (admin.role.name !== 'admin') {
        throw new BadRequestException('The admin does not have the required role.');
      }
    }

    const car = await this.carRepository.findOne({
      where: { id: carId },
    });
    if (!car) {
      throw new BadRequestException('The car does not exist.');
    }

    const existingRent = await this.rentRepository.findOne({
      where: {
        car: { id: carId },
        startingDate: LessThanOrEqual(dueDate as Date),
        dueDate: MoreThanOrEqual(startingDate as Date),
      },
    });

    if (existingRent) {
      throw new BadRequestException(
        'This car is already rented for the selected period',
      );
    }

    const newRent = this.rentRepository.create({
      ...createRentDto,
      car,
      user,
      admin,
    });
    return this.rentRepository.save(newRent);
  }

  findAll() {
    return this.rentRepository.find({
      relations: ['car', 'user', 'admin'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.rentRepository.findOne({
      where: { id },
      relations: ['car', 'user', 'admin'],
    });
  }

  findByUser(userId: number) {
    return this.rentRepository.find({
      where: { user: { id: userId } },
      relations: ['car', 'user', 'admin'],
      order: { createdAt: 'DESC' },
    });
  }

  findByCar(carId: number) {
    return this.rentRepository.find({
      where: { car: { id: carId } },
      relations: ['car', 'user', 'admin'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateRentDto: UpdateRentDto) {
    const { carId, userId, adminId, startingDate, dueDate } = updateRentDto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });
    if (!user) {
      throw new BadRequestException('The user does not exist.');
    }

    if (user.role.name !== 'user') {
      throw new BadRequestException('The user does not have the required role.');
    }

    const admin = await this.userRepository.findOne({
      where: { id: adminId },
      relations: ['role'],
    });
    if (!admin) {
      throw new BadRequestException('The admin does not exist.');
    }

    if (admin.role.name !== 'admin') {
      throw new BadRequestException('The admin does not have the required role.');
    }

    const car = await this.carRepository.findOne({
      where: { id: carId },
    });
    if (!car) {
      throw new BadRequestException('The car does not exist.');
    }

    const existingRent = await this.rentRepository.findOne({
      where: {
        car: { id: carId },
        startingDate: LessThanOrEqual(dueDate as Date),
        dueDate: MoreThanOrEqual(startingDate as Date),
      },
    });

    if (existingRent && existingRent.id !== id) {
      throw new BadRequestException(
        'This car is already rented for the selected period',
      );
    }

    return this.rentRepository.update(id, {
      ...updateRentDto,
      updatedAt: new Date(),
    });
  }

  remove(id: number) {
    return this.rentRepository.delete(id);
  }

  async cancelRent(id: number) {
    const rent = await this.rentRepository.findOne({
      where: { id },
      relations: ['car', 'user', 'admin'],
    });
    if (!rent) {
      throw new BadRequestException('The rent does not exist.');
    }
    rent.rejected = true; 
    return this.rentRepository.save(rent);
  }

  findRentsByStatus(status: string) {
    let where;
    switch (status) {
      case 'accepted':
      where = { acceptedDated: Not(IsNull()), rejected: false };
      break;
      case 'pending':
      where = { acceptedDated: IsNull(), rejected: false };
      break;
      case 'rejected':
      where = { rejected: true };
      break;
      default:
      throw new BadRequestException('Invalid status.');
    }
    return this.rentRepository.find({
      where,
      relations: ['car', 'user', 'admin'],
    });
  }

  async listRentRequests() {
    return this.rentRepository.find({
      relations: ['car', 'user', 'admin'],
      order: { createdAt: 'DESC' },
    });
  }

  async admitRentRequest(id: number, admin: User) {
    const rent = await this.rentRepository.findOne({
      where: { id, rejected: false },
    });
    if (!rent) {
      throw new BadRequestException('The rent does not exist.');
    }
    
    
    const adminEntity = await this.userRepository.findOne({
      where: { id: admin.id },
      relations: ['role'],
    });
    if (!adminEntity) {
      throw new BadRequestException('Admin not found.');
    }
    
    rent.acceptedDated = new Date();
    rent.rejected = false;
    rent.admin = adminEntity;
    return this.rentRepository.save(rent);
  }
  
  async rejectRentRequest(id: number, admin: User) {
    const rent = await this.rentRepository.findOne({
      where: { id, rejected: false },
    });
    if (!rent) {
      throw new BadRequestException('The rent does not exist.');
    }

    const adminEntity = await this.userRepository.findOne({
      where: { id: admin.id },
      relations: ['role'],
    });
    rent.admin = adminEntity;
    rent.rejected = true;
    return this.rentRepository.save(rent);
  }

  async getUserRentHistory(userId: number) {
    return this.rentRepository.find({
      where: { user: { id: userId } },
      relations: ['car', 'user', 'admin'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllRentHistory() {
    return this.rentRepository.find({
      relations: ['car', 'user', 'admin'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUnavailableDates(carId: number): Promise<{ start: Date; end: Date }[]> {
    const rentals = await this.rentRepository.find({
      where: { car: { id: carId }, acceptedDated: Not(IsNull()) },
      select: ['startingDate', 'dueDate'],
    });
    return rentals.map(rental => ({
      start: rental.startingDate,
      end: rental.dueDate as Date,
    }));
  }
}
