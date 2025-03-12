import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    firstName?: string;
    lastName?: string;
    dob?: Date;
    email?: string;
    address?: string;
    country?: string;
    roleName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
