import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
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

    @ManyToOne(() => Role, role => role.users, {eager: true})
    @JoinColumn({name: 'roleId'})
    role: Role;//tipo rol

    @OneToMany(() => Document, document => document.user)   
    documents: Document[];//tipo documento

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type: 'datetime'})
    updatedAt: Date;

}
