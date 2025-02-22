export class CreateCarDto {
    brand: string;
    model: string;    
    color: string;
    passengers: number;
    ac: boolean;
    princePerDay: number;
    craetedAt?: Date;
    updatedAt?: Date;
}
