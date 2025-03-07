export class CreateCarDto {
    brand: string;
    model: string;    
    color: string;
    passengers: number;
    ac: boolean;
    pricePerDay: number;
    craetedAt?: Date;
    updatedAt?: Date;
}
