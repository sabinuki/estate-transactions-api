import { Test, TestingModule } from '@nestjs/testing';
import { TownPlanningController } from '..';
import { INTERFACES } from '../town-planning.constants';
import { GetEstateTransactionRequestDto } from './dto/requests';

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
    it('should return exact match data when all parameters match', async () => {
      mockUseCase.getEstateTransaction.mockResolvedValue([
        {
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
      ]);

      const query = {
        year: 2015,
        prefCode: 13,
        type: 1,
      };
      const result = await controller.getEstateTransaction(
        query as GetEstateTransactionRequestDto,
      );

      expect(result).toMatchObject({
        data: [
          {
            prefectureCode: '13',
            prefectureName: '東京都',
            type: '1',
            years: [{ year: 2015, value: 324740 }],
          },
        ],
      });
    });

    it('should return empty array when parameters do not match any data', async () => {
      mockUseCase.getEstateTransaction.mockResolvedValue([]);

      const query = {
        year: 2020,
        prefCode: 13,
        type: 1,
      };
      const result = await controller.getEstateTransaction(
        query as GetEstateTransactionRequestDto,
      );

      expect(result).toMatchObject({ data: [] });
    });
  });
});
