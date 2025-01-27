import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

    @Column({type: 'datetime'})
    createdAt: Date;

    @Column({type: 'datetime'})
    updatedAt: Date;
}
