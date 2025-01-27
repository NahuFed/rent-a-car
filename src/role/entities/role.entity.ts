import {Entity, PrimaryColumn, OneToMany} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

export enum RoleType {
    ADMIN = 'admin',
    USER = 'user'
}

@Entity()
export class Role {  
 

    @PrimaryColumn({
        type: 'enum',
        enum: RoleType,
        unique: true,
    })
    name: RoleType;

    @OneToMany(() => User, user => user.role)
    users: User[];  

}