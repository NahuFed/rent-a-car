import { Test, TestingModule } from '@nestjs/testing';
import { CarPictureController } from './car-picture.controller';

describe('CarPictureController', () => {
  let controller: CarPictureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarPictureController],
    }).compile();

    controller = module.get<CarPictureController>(CarPictureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
