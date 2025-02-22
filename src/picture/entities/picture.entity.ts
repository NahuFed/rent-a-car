import { Car } from "src/car/entities/car.entity";
import { CarPicture } from "src/car-picture/entities/car-picture.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany} from "typeorm";

@Entity()
export class Picture {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    src: string;

    @Column()
    description: string;

    @Column()
    title: string;

    @ManyToOne(() => CarPicture, carPicture => carPicture.pictures, {eager: true})
    @JoinColumn({name : 'typeName'})
    type: CarPicture;

    @Column()
    date: Date;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    createdAt?: Date;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt?: Date;

    @ManyToOne(() => Car, car => car.img)
    car: Car;

}
