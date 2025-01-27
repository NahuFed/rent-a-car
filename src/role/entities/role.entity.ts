import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

export enum RoleType {
    ADMIN = 'admin',
    USER = 'user'
}

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: RoleType,
        unique: true,
    })
    name: RoleType;

    @OneToMany(() => User, user => user.role)
    users: User[];
    

}