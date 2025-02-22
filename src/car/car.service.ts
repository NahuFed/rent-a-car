import { Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car) private carRepository: Repository<Car>,
  ) {}
  create(createCarDto: CreateCarDto) {
    const newCar = this.carRepository.create(createCarDto);
    return this.carRepository.save(newCar);
  }

  findAll() {
    return this.carRepository.find();
  }

  findOne(id: number) {
    return this.carRepository.findOne({
      where: { id },
  });
  }


  update(id: number, updateCarDto: UpdateCarDto) {
    return this.carRepository.update(id, {
      ...updateCarDto,
      updatedAt: new Date(),
    });
  }

  remove(id: number) {
    return this.carRepository.delete(id);
  }
}
