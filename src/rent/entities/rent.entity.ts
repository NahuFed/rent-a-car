import { Car } from 'src/car/entities/car.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Rent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Car, (car) => car.rents, { eager: true })
  @JoinColumn({ name: 'carId' })
  car: Car;

  @Column()
  pricePerDay: number;

  @ManyToOne(() => User, (user) => user.rents)
  @JoinColumn({ name: 'userId' })
  user: User;
  
  @ManyToOne(() => User, (user) => user.rents)
  @JoinColumn({ name: 'adminId' })
  admin: User;

  @Column({ type: 'date', nullable: true })
  acceptedDated: Date | null;

  @Column()
  rejected: boolean;

  @Column({ type: 'date' })
  startingDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
