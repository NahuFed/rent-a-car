import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { RentService } from './rent.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { RoleType } from 'src/role/entities/role.entity';

@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.USER)
  @Post()
  create(@Body() createRentDto: CreateRentDto) {
    return this.rentService.create(createRentDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADMIN)
  @Get()
  findAll() {
    return this.rentService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentService.findOne(+id);
  }

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleType.ADMIN)
  @Get('user/:id')
  findByUser(@Param('id') id: string) {
    return this.rentService.findByUser(+id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADMIN)
  @Get('car/:id')
  findByCar(@Param('id') id: string) {
    return this.rentService.findByCar(+id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRentDto: UpdateRentDto) {
    return this.rentService.update(+id, updateRentDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentService.remove(+id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADMIN)
  @Patch(':id/cancel')
  cancelRent(@Param('id') id: string) {
    return this.rentService.cancelRent(+id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADMIN)
  @Get('status/:status')
  findRentsByStatus(@Param('status') status: string) {
    return this.rentService.findRentsByStatus(status);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADMIN)
  @Get('requests')
  listRentRequests() {
    return this.rentService.listRentRequests();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADMIN)
  @Patch('requests/:id/admit')
  admitRentRequest(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() admin: User,
  ) {
    return this.rentService.admitRentRequest(id, admin);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADMIN)
  @Patch('requests/:id/reject')
  rejectRentRequest(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() admin: User,
  ) {
    return this.rentService.rejectRentRequest(id, admin);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(RoleType.ADMIN)
  @Get('user/:id/history')
  getUserRentHistory(@Param('id') id: string) {
    return this.rentService.getUserRentHistory(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(RoleType.ADMIN)
  @Get('history')
  getAllRentHistory() {
    return this.rentService.getAllRentHistory();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me/history')
  getMyRentHistory(@GetUser() user: User) {
    return this.rentService.getUserRentHistory(user.id);
  }

  @Get('availability/:carId')
  async getAvailability(@Param('carId') carId: string) {
    const unavailableDates = await this.rentService.getUnavailableDates(+carId);
    return { unavailableDates };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADMIN)
  @Patch(':id/finish')
  finishRent(@Param('id') id: string) {
    return this.rentService.finishRent(+id);
  }
  

}
