import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Picture } from './entities/picture.entity';
import { CarPictureType } from 'src/car-picture/entities/car-picture.entity';

@Injectable()
export class PictureService {
  constructor(
    @InjectRepository(Picture) private pictureRepository: Repository<Picture>,
  ) {}
  create(createPictureDto: CreatePictureDto) {
    const newPicture = this.pictureRepository.create(createPictureDto);
    return this.pictureRepository.save(newPicture);
  }

  findAll() {
    return this.pictureRepository.find();
  }

  findOne(id: number) {
    return this.pictureRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updatePictureDto: UpdatePictureDto): Promise<Picture> {
    await this.pictureRepository.update(id, {
      ...updatePictureDto,
      updatedAt: new Date(),
    });
    const updatedPicture = await this.pictureRepository.findOne({ where: { id } });
    if (!updatedPicture) {
      throw new NotFoundException(`Picture with ID ${id} not found`);
    }
    return updatedPicture;
  }

  remove(id: number) {
    return this.pictureRepository.delete(id);
  }

  findByCar(carId: number, type?: CarPictureType) {
    const query = this.pictureRepository
      .createQueryBuilder('picture')
      .leftJoinAndSelect('picture.type', 'carPicture')
      .where('picture.carId = :carId', { carId });

    if (type) {
      query.andWhere('carPicture.name = :type', { type });
    }

    return query.getMany();
  }
}
