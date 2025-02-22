import { Test, TestingModule } from '@nestjs/testing';
import { CarPictureService } from './car-picture.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarPicture, CarPictureType } from './entities/car-picture.entity';

const mockCarPictureRepository = {
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('CarPictureService', () => {
  let service: CarPictureService;
  let repository: Repository<CarPicture>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarPictureService,
        {
          provide: getRepositoryToken(CarPicture),
          useValue: mockCarPictureRepository,
        },
      ],
    }).compile();

    service = module.get<CarPictureService>(CarPictureService);
    repository = module.get<Repository<CarPicture>>(getRepositoryToken(CarPicture));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initializeCarPictures', () => {
    it('should initialize car pictures if none exist', async () => {
      const carPictureTypes = [
        CarPictureType.FRONT,
        CarPictureType.BACK,
        CarPictureType.SIDE,
        CarPictureType.OTHER,
      ];

      mockCarPictureRepository.find.mockResolvedValue([]);
      mockCarPictureRepository.create.mockImplementation((dto) => dto);
      mockCarPictureRepository.save.mockResolvedValue(carPictureTypes);

      await service.initializeCarPictures();

      expect(mockCarPictureRepository.find).toHaveBeenCalled();
      expect(mockCarPictureRepository.create).toHaveBeenCalledTimes(4);
      expect(mockCarPictureRepository.save).toHaveBeenCalledWith([
        { name: CarPictureType.FRONT },
        { name: CarPictureType.BACK },
        { name: CarPictureType.SIDE },
        { name: CarPictureType.OTHER },
      ]);
    });


    
    
    
    
  });
});