import { IsNumber, IsDate, IsOptional, IsBoolean } from 'class-validator';

export class CreateRentDto {
  @IsNumber()
  carId: number;

  @IsNumber()
  pricePerDay: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  adminId: number;

  @IsDate()
  startingDate: Date;

  @IsDate()
  dueDate: Date;

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
