import { TownPlanningUseCase } from './town-planning.use-case';
import type { TownPlanningUseCaseInterface } from './town-planning.use-case';
import { Test, TestingModule } from '@nestjs/testing';
import { INTERFACES } from '../town-planning.constants';

describe('TownPlanningUseCase', () => {
  let useCase: TownPlanningUseCaseInterface;
  let mockRepository: {
    getEstateTransaction: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
      getEstateTransaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TownPlanningUseCase,
        {
          provide: INTERFACES.I_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<TownPlanningUseCaseInterface>(TownPlanningUseCase);
  });

  describe('getEstateTransaction', () => {
    it('should return estate transaction data when query matches', async () => {
      const query = {
        year: '2015',
        prefectureCode: '13',
        type: '1',
      };

      mockRepository.getEstateTransaction.mockResolvedValue([
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

      const result = await useCase.getEstateTransaction(query);

      expect(result).toHaveLength(1);
      expect(result[0].data.result.prefectureCode).toBe('13');
      expect(result[0].data.result.prefectureName).toBe('東京都');
      expect(result[0].data.result.type).toBe('1');
      expect(result[0].data.result.years[0].year).toBe(2015);
      expect(result[0].data.result.years[0].value).toBe(324740);
    });

    it('should return data with correct structure', async () => {
      const query = {
        year: '2015',
        prefectureCode: '13',
        type: '1',
      };

      mockRepository.getEstateTransaction.mockResolvedValue([
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

      const result = await useCase.getEstateTransaction(query);

      expect(result[0]).toHaveProperty('data');
      expect(result[0].data).toHaveProperty('result');
      expect(result[0].data.result).toHaveProperty('prefectureCode');
      expect(result[0].data.result).toHaveProperty('prefectureName');
      expect(result[0].data.result).toHaveProperty('type');
      expect(result[0].data.result).toHaveProperty('years');
      expect(Array.isArray(result[0].data.result.years)).toBe(true);
      expect(result[0].data.result.years[0]).toHaveProperty('year');
      expect(result[0].data.result.years[0]).toHaveProperty('value');
    });

    it('should return Promise<EstateTransactionData[]>', async () => {
      const query = {
        year: '2015',
        prefectureCode: '13',
        type: '1',
      };

      mockRepository.getEstateTransaction.mockResolvedValue([
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

      const result = await useCase.getEstateTransaction(query);

      expect(result).toBeInstanceOf(Array);
      expect(typeof result).toBe('object');
    });

    it('should throw BadRequestException with 400 status when year parameter is not before 2015', async () => {
      const query = {
        year: '2014',
        prefectureCode: '13',
        type: '1',
      };

      await expect(useCase.getEstateTransaction(query)).rejects.toMatchObject({
        status: 400,
        message: 'No data available for the specified year',
      });
    });

    it('should throw BadRequestException with 400 status when year parameter is not after 2021', async () => {
      const query = {
        year: '2022',
        prefectureCode: '13',
        type: '1',
      };

      await expect(useCase.getEstateTransaction(query)).rejects.toMatchObject({
        status: 400,
        message: 'No data available for the specified year',
      });
    });

    it('should throw BadRequestException with 400 status when prefectureCode parameter is not a valid Kanto prefecture code', async () => {
      const query = {
        year: '2015',
        prefectureCode: '15',
        type: '1',
      };

      await expect(useCase.getEstateTransaction(query)).rejects.toMatchObject({
        status: 400,
        message: 'No data available for the specified prefecture code',
      });
    });

    it('should throw BadRequestException with 400 status when type parameter is not a valid type', async () => {
      const query = {
        year: '2015',
        prefectureCode: '13',
        type: '3',
      };

      await expect(useCase.getEstateTransaction(query)).rejects.toMatchObject({
        status: 400,
        message: 'No data available for the specified type',
      });
    });
  });

  describe('EstateTransactionUseCase interface', () => {
    it('should implement EstateTransactionUseCase interface', () => {
      expect(useCase).toHaveProperty('getEstateTransaction');
      expect(typeof useCase.getEstateTransaction).toBe('function');
    });
  });
});
