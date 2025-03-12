import {Entity, PrimaryColumn, OneToMany} from 'typeorm';
import { Picture } from 'src/picture/entities/picture.entity';

export enum CarPictureType {
    FRONT = 'front',
    BACK = 'back',
    SIDE = 'side',
    OTHER = 'other'
}

@Entity()
export class CarPicture {  
 

    @PrimaryColumn({
        type: 'enum',
        enum: CarPictureType,
        unique: true,
    })
    name: CarPictureType;

    @OneToMany(() => Picture, picture => picture.type)
    pictures: Picture[];  

}