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

  @Post()
  create(@Body() createRentDto: CreateRentDto) {
    return this.rentService.create(createRentDto);
  }

  @Get()
  findAll() {
    return this.rentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentService.findOne(+id);
  }

  @Get('user/:id')
  findByUser(@Param('id') id: string) {
    return this.rentService.findByUser(+id);
  }

  @Get('car/:id')
  findByCar(@Param('id') id: string) {
    return this.rentService.findByCar(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRentDto: UpdateRentDto) {
    return this.rentService.update(+id, updateRentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentService.remove(+id);
  }


  @Patch(':id/cancel')
  cancelRent(@Param('id') id: string) {
    return this.rentService.cancelRent(+id);
  }

  @Get('status/:status')
  findRentsByStatus(@Param('status') status: string) {
    return this.rentService.findRentsByStatus(status);
  }


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


  @Get('user/:id/history')
  getUserRentHistory(@Param('id') id: string) {
    return this.rentService.getUserRentHistory(+id);
  }

  @Get('history')
  getAllRentHistory() {
    return this.rentService.getAllRentHistory();
  }

  @Get('availability/:carId')
  async getAvailability(@Param('carId') carId: string) {
    const unavailableDates = await this.rentService.getUnavailableDates(+carId);
    return { unavailableDates };
  }
}
