export class CreateUserDto {
    firstName: string;
    lastName: string;
    dob: Date;
    address: string;
    country: string;
    roleName: string;
    createdAt?: Date;
    updatedAt?: Date;
}
