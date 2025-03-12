import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Document {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column()
    src: string;

    @Column()
    description: string;

    @Column()
    title: string;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @ManyToOne(() => User, user => user.documents)
    user: User;
}
