import { PartialType } from '@nestjs/mapped-types';
import { CreateRentDto } from './create-rent.dto';
import { IsNumber, IsDate, IsOptional, IsBoolean } from 'class-validator';

export class UpdateRentDto extends PartialType(CreateRentDto) {
  @IsOptional()
  @IsNumber()
  carId?: number;

  @IsOptional()
  @IsNumber()
  pricePerDay?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;
  
  @IsOptional()
  @IsNumber()
  adminId?: number;


  @IsOptional()
  @IsDate()
  startingDate?: Date;

  @IsOptional()
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsDate()
  acceptedDated?: Date | null;

  @IsOptional()
  @IsBoolean()
  rejected?: boolean;

  @IsOptional()
  @IsDate()
  endDate?: Date | null;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}