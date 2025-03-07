    import { Role } from "src/role/entities/role.entity";

    export class CreateUserDto {
        firstName: string;
        lastName: string;
        dob: Date;
        email: string;
        address: string;
        country: string;
        role: Role;
        createdAt?: Date;
        updatedAt?: Date;
    }
