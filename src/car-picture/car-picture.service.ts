import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarPicture, CarPictureType } from './entities/car-picture.entity';

@Injectable()
export class CarPictureService {
  constructor(
    @InjectRepository(CarPicture)
    private readonly carPictureRepository: Repository<CarPicture>,
  ) {}

  async initializeCarPictures(): Promise<void> {
    const existingCarPictures = await this.carPictureRepository.find();
    const existingTypes = new Set(existingCarPictures.map(cp => cp.name)); // 🔹 Guardamos los tipos ya existentes
  
    const missingTypes = Object.values(CarPictureType).filter(type => !existingTypes.has(type)); // 🔹 Comparamos con el ENUM
  
    if (missingTypes.length > 0) {
      const carPictureEntities = missingTypes.map(type => this.carPictureRepository.create({ name: type }));
      await this.carPictureRepository.save(carPictureEntities);
    }
  }
}