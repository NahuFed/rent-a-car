import { Car } from "src/car/entities/car.entity";
import { CarPicture } from "src/car-picture/entities/car-picture.entity";

export class CreatePictureDto {
    car: Car;
    src: string;
    description:string;
    title: string;
    type: CarPicture;
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
