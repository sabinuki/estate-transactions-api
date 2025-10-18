import { Test, TestingModule } from '@nestjs/testing';
import { TownPlanningController } from './';

interface EstateTransactionData {
  data: {
    result: {
      prefectureCode: string;
      prefectureName: string;
      type: string;
      years: {
        year: number;
        value: number;
      }[];
    };
  };
}

describe('TownPlanningController', () => {
  let controller: TownPlanningController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TownPlanningController],
    }).compile();

    controller = module.get<TownPlanningController>(TownPlanningController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEstateTransactionBar', () => {
    it('should throw BadRequestException with 400 status when no parameters provided', async () => {
      await expect(controller.getEstateTransactionBar()).rejects.toMatchObject({
        status: 400,
        message:
          'Missing required query parameters: year, prefCode, type are all required',
      });
    });

    it('should return exact match data when all parameters match', async () => {
      const result = await controller.getEstateTransactionBar(
        '2015',
        '13',
        '1',
      );

      expect(result).toMatchObject({
        data: [
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
        ],
        message: 'Estate transaction data retrieved successfully',
      });
    });

    it('should return empty array when parameters do not match any data', async () => {
      const result = await controller.getEstateTransactionBar(
        '2020',
        '13',
        '1',
      );

      expect(result).toMatchObject({
        data: [],
        message: 'Estate transaction data retrieved successfully',
      });
    });

    it('should throw BadRequestException with 400 status when year parameter is missing', async () => {
      await expect(
        controller.getEstateTransactionBar(undefined, '13', '1'),
      ).rejects.toMatchObject({
        status: 400,
        message:
          'Missing required query parameters: year, prefCode, type are all required',
      });
    });

    it('should throw BadRequestException with 400 status when prefectureCode parameter is missing', async () => {
      await expect(
        controller.getEstateTransactionBar('2015', undefined, '1'),
      ).rejects.toMatchObject({
        status: 400,
        message:
          'Missing required query parameters: year, prefCode, type are all required',
      });
    });

    it('should throw BadRequestException with 400 status when type parameter is missing', async () => {
      await expect(
        controller.getEstateTransactionBar('2015', '13', undefined),
      ).rejects.toMatchObject({
        status: 400,
        message:
          'Missing required query parameters: year, prefCode, type are all required',
      });
    });

    it('should return data with correct structure when data exists', async () => {
      const result = await controller.getEstateTransactionBar(
        '2015',
        '13',
        '1',
      );

      expect(result).toMatchObject({
        message: 'Estate transaction data retrieved successfully',
      });
      expect(Array.isArray(result.data)).toBe(true);

      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((item: EstateTransactionData) => {
        expect(item).toHaveProperty('data');
        expect(item.data).toHaveProperty('result');
        expect(item.data.result).toHaveProperty('years');
        expect(item.data.result).toHaveProperty('prefectureCode');
        expect(item.data.result).toHaveProperty('prefectureName');
        expect(item.data.result).toHaveProperty('type');

        expect(Array.isArray(item.data.result.years)).toBe(true);
        expect(typeof item.data.result.years[0].year).toBe('number');
        expect(typeof item.data.result.years[0].value).toBe('number');
        expect(typeof item.data.result.prefectureCode).toBe('string');
        expect(typeof item.data.result.prefectureName).toBe('string');
        expect(typeof item.data.result.type).toBe('string');
      });
    });
  });
});
