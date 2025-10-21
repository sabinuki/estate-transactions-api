import { Test, TestingModule } from '@nestjs/testing';
import { TownPlanningController } from '..';
import { INTERFACES } from '../town-planning.constants';

describe('TownPlanningController', () => {
  let controller: TownPlanningController;
  let mockUseCase: {
    getEstateTransaction: jest.Mock;
  };

  beforeEach(async () => {
    mockUseCase = {
      getEstateTransaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TownPlanningController],
      providers: [
        {
          provide: INTERFACES.I_USE_CASE,
          useValue: mockUseCase,
        },
      ],
    }).compile();

    controller = module.get<TownPlanningController>(TownPlanningController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEstateTransaction', () => {
    it('should throw BadRequestException with 400 status when no parameters provided', async () => {
      await expect(controller.getEstateTransaction()).rejects.toMatchObject({
        status: 400,
        message:
          'Missing required query parameters: year, prefCode, type are all required',
      });
    });

    it('should return exact match data when all parameters match', async () => {
      mockUseCase.getEstateTransaction.mockResolvedValue([
        {
          data: {
            result: {
              prefectureCode: '13',
              prefectureName: '東京都',
              type: '1',
              years: [
                {
                  year: 2015,
                  value: 324740,
                },
              ],
            },
          },
        },
      ]);

      const result = await controller.getEstateTransaction('2015', '13', '1');

      expect(result).toMatchObject([
        {
          data: {
            result: {
              prefectureCode: '13',
              prefectureName: '東京都',
              type: '1',
              years: [
                {
                  year: 2015,
                  value: 324740,
                },
              ],
            },
          },
        },
      ]);
    });

    it('should return empty array when parameters do not match any data', async () => {
      mockUseCase.getEstateTransaction.mockResolvedValue([]);

      const result = await controller.getEstateTransaction('2020', '13', '1');

      expect(result).toMatchObject([]);
    });

    it('should throw BadRequestException with 400 status when year parameter is missing', async () => {
      await expect(
        controller.getEstateTransaction(undefined, '13', '1'),
      ).rejects.toMatchObject({
        status: 400,
        message:
          'Missing required query parameters: year, prefCode, type are all required',
      });
    });

    it('should throw BadRequestException with 400 status when prefectureCode parameter is missing', async () => {
      await expect(
        controller.getEstateTransaction('2015', undefined, '1'),
      ).rejects.toMatchObject({
        status: 400,
        message:
          'Missing required query parameters: year, prefCode, type are all required',
      });
    });

    it('should throw BadRequestException with 400 status when type parameter is missing', async () => {
      await expect(
        controller.getEstateTransaction('2015', '13', undefined),
      ).rejects.toMatchObject({
        status: 400,
        message:
          'Missing required query parameters: year, prefCode, type are all required',
      });
    });

    it('should throw BadRequestException with 400 status when year parameter is before 2009', async () => {
      await expect(
        controller.getEstateTransaction('2008', '13', '1'),
      ).rejects.toMatchObject({
        status: 400,
        message: 'Invalid year: must be between 2009 and 2021',
      });
    });

    it('should throw BadRequestException with 400 status when year parameter is after 2021', async () => {
      await expect(
        controller.getEstateTransaction('2022', '13', '1'),
      ).rejects.toMatchObject({
        status: 400,
        message: 'Invalid year: must be between 2009 and 2021',
      });
    });
  });
});
