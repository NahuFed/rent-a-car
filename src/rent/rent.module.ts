import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from './entities/rent.entity';
import { UserModule } from 'src/user/user.module';
import { CarModule } from 'src/car/car.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rent]),
    UserModule,
    CarModule,
  ],
  providers: [RentService],
  controllers: [RentController],
  exports: [RentService, TypeOrmModule],
})
export class RentModule {}