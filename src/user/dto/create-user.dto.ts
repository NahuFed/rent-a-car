export class CreateUserDto {
    firstName: string;
    lastName: string;
    dob: Date;
    email: string;
    address: string;
    country: string;
    roleName: string;
    createdAt?: Date;
    updatedAt?: Date;
}
