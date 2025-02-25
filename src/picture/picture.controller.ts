import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { PictureService } from './picture.service';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { CarPictureType } from 'src/car-picture/entities/car-picture.entity';

@Controller('picture')
export class PictureController {
  constructor(private readonly pictureService: PictureService) {}

  @Post()
  create(@Body() createPictureDto: CreatePictureDto) {
    return this.pictureService.create(createPictureDto);
  }

  @Get()
  findAll() {
    return this.pictureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pictureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePictureDto: UpdatePictureDto) {
    return this.pictureService.update(+id, updatePictureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pictureService.remove(+id);
  }

  @Get('/cars/:carId')
  async findPicturesByCar(
    @Param('carId', ParseIntPipe) carId: number,
    @Query('type') type?: CarPictureType, 
  ) {
    return await this.pictureService.findByCar(carId, type);
  }
}

