import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
import { Document } from 'src/document/entities/document.entity';
import { Role } from 'src/role/entities/role.entity';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    dob: Date;

    @Column()
    address: string;

    @Column()
    country: string;

    @Column()
    role: Role;//tipo rol

    @Column()
    documents: Document;//tipo documento

    @Column({type: 'datetime'})
    createdAt: Date;

    @Column({type: 'datetime'})
    updatedAt: Date;

}
