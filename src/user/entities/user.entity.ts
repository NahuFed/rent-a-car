import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import { Document } from '../../document/entities/document.entity';
import { Role } from '../../role/entities/role.entity';
import { Rent } from 'src/rent/entities/rent.entity';


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
    email: string;

    @Column()
    address: string;

    @Column()
    country: string;

    @ManyToOne(() => Role, role => role.users, {eager: true})
    @JoinColumn({name: 'role'})
    role: Role;

    @OneToMany(() => Document, document => document.user)   
    documents: Document[];

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @OneToMany(() => Rent, rent => rent.user)
    rents: Rent[];
}
