import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarPicture } from './entities/car-picture.entity';
import { CarPictureController } from './car-picture.controller';
import { CarPictureService } from './car-picture.service';

@Module({
  imports: [TypeOrmModule.forFeature([CarPicture])],
  providers: [CarPictureService],
  controllers: [CarPictureController],
  exports: [CarPictureService, TypeOrmModule]
})
export class CarPictureModule implements OnModuleInit {
  constructor (private readonly carPictureService: CarPictureService) {}

  async onModuleInit(){
    await this.carPictureService.initializeCarPictures();
  }
}
