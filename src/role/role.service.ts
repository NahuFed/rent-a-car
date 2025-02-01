import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RoleType } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async initializeRoles() {
    const roles = await this.roleRepository.find();
    if (roles.length === 0) {
      const adminRole = this.roleRepository.create({ name: RoleType.ADMIN });
      const userRole = this.roleRepository.create({ name: RoleType.USER });
      await this.roleRepository.save([adminRole, userRole]);
    }
  }
}