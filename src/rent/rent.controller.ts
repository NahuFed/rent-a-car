import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RentService } from './rent.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';

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

  @Patch(':id/extend')
  extendRent(@Param('id') id: string, @Body('newDueDate') newDueDate: Date) {
    return this.rentService.extendRent(+id, newDueDate);
  }

  @Patch(':id/cancel')
  cancelRent(@Param('id') id: string) {
    return this.rentService.cancelRent(+id);
  }

  @Get('status/:status')
  findRentsByStatus(@Param('status') status: string) {
    return this.rentService.findRentsByStatus(status);
  }

  @Get('active')
  findActiveRents() {
    return this.rentService.findActiveRents();
  }

  @Get('past')
  findPastRents() {
    return this.rentService.findPastRents();
  }

  @Get('future')
  findFutureRents() {
    return this.rentService.findFutureRents();
  }

  @Get('requests')
  listRentRequests() {
    return this.rentService.listRentRequests();
  }

  @Patch('requests/:id/admit')
  admitRentRequest(@Param('id') id: string) {
    return this.rentService.admitRentRequest(+id);
  }

  @Patch('requests/:id/reject')
  rejectRentRequest(@Param('id') id: string) {
    return this.rentService.rejectRentRequest(+id);
  }

  @Get('user/:id/history')
  getUserRentHistory(@Param('id') id: string) {
    return this.rentService.getUserRentHistory(+id);
  }

  @Get('history')
  getAllRentHistory() {
    return this.rentService.getAllRentHistory();
  }
}
