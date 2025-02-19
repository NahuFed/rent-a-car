import { IsEmail, IsString, Matches, ValidateNested } from 'class-validator';
import { Role } from 'src/role/entities/role.entity';
import { Type } from 'class-transformer';

export class AuthRegisterUserDto {

  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  dob: string;

  @IsString()
  address: string;

  @IsString()
  country: string;

  @ValidateNested()
  @Type(() => Role)
  role: Role;

  /* Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character */

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' },
  )
  password: string;

}