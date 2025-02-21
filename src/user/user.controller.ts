import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RoleType } from 'src/role/entities/role.entity';
import { RolesGuard } from 'src/auth/roles.guard';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() newUser: CreateUserDto): Promise<User> {
    return this.userService.create(newUser);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @Roles(RoleType.ADMIN)
  getUsers(): Promise <User[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    const user = await this.userService.getUser(+id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number){
    return this.userService.deleteUser(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: number, @Body() user: UpdateUserDto) {
    return this.userService.updateUser(id, user);
  }
}
