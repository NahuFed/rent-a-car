import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  create(user: CreateUserDto) {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }
  getUsers() {
    return this.userRepository.find();
  }

  getUser(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  deleteUser(id: number) {
    return this.userRepository.delete(id);
  }

  updateUser(id: number, user: UpdateUserDto) {
    return this.userRepository.update(id, {
      ...user,
      updatedAt: new Date(),
    });
  }

  private verificationCodes = new Map<string, string>();

  async storeVerificationCode(email: string, code: string) {
    this.verificationCodes.set(email, code);    
    setTimeout(() => this.verificationCodes.delete(email), 10 * 60 * 1000); 
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    const storedCode = this.verificationCodes.get(email);
    return storedCode === code;
  }

}
