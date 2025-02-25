import { Picture } from "src/picture/entities/picture.entity";
import { Rent } from "src/rent/entities/rent.entity";
import { Column, PrimaryGeneratedColumn, OneToMany, Entity} from "typeorm";

@Entity()
export class Car { 
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    brand: string;

    @Column()
    model: string;

    @OneToMany(() => Picture, picture => picture.car)  
    img: Picture[];

    @Column()
    color: string;

    @Column()
    passengers: number;

    @Column()
    ac: boolean;

    @Column()
    princePerDay: number;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    craetedAt?: Date;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt?: Date;

    @OneToMany(() => Rent, rent => rent.car)
    rents: Rent[];
}
