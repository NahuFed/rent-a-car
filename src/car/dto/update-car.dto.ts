import { PartialType } from '@nestjs/mapped-types';
import { CreateCarDto } from './create-car.dto';

export class UpdateCarDto extends PartialType(CreateCarDto) {
     brand?: string;
     model?: string;     
     color?: string;
     passengers?: number;
     ac?: boolean;
     pricePerDay?: number;
     craetedAt?: Date;
     updatedAt?: Date;    
}
