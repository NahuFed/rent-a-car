import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PictureService } from './picture.service';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { CarPictureType } from 'src/car-picture/entities/car-picture.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RoleType } from 'src/role/entities/role.entity';
import { RolesGuard } from 'src/auth/roles.guard';
@Controller('picture')
export class PictureController {
  constructor(private readonly pictureService: PictureService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADMIN)
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePictureDto: UpdatePictureDto) {
    return this.pictureService.update(+id, updatePictureDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADMIN)
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

