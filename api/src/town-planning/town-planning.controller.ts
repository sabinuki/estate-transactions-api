import { Controller, Get, Query, BadRequestException } from '@nestjs/common';

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

interface EstateTransactionUseCase {
  getEstateTransactionBar(query: {
    year: number;
    prefectureCode: number;
    type: number;
  }): Promise<EstateTransactionData[]>;
}

// TODO: モックデータを削除する
class MockEstateTransactionUseCase implements EstateTransactionUseCase {
  private mockData: EstateTransactionData[] = [
    {
      data: {
        result: {
          prefectureCode: '13',
          prefectureName: '東京都',
          type: '1',
          years: [{ year: 2015, value: 324740 }],
        },
      },
    },
    {
      data: {
        result: {
          prefectureCode: '13',
          prefectureName: '東京都',
          type: '1',
          years: [{ year: 2016, value: 328199 }],
        },
      },
    },
  ];

  async getEstateTransactionBar(query: {
    year: number;
    prefectureCode: number;
    type: number;
  }): Promise<EstateTransactionData[]> {
    return Promise.resolve(
      this.mockData.filter((item) => {
        return (
          item.data.result.years[0].year === query.year &&
          item.data.result.prefectureCode === query.prefectureCode.toString() &&
          item.data.result.type === query.type.toString()
        );
      }),
    );
  }
}

@Controller('api/v1/townPlanning')
export class TownPlanningController {
  private readonly useCase: EstateTransactionUseCase;

  constructor() {
    // TODO: モックを削除
    this.useCase = new MockEstateTransactionUseCase();
  }

  @Get('estateTransaction/bar')
  async getEstateTransactionBar(
    @Query('year') year?: string,
    @Query('prefCode') prefectureCode?: string,
    @Query('type') type?: string,
  ) {
    if (!year || !prefectureCode || !type) {
      throw new BadRequestException(
        'Missing required query parameters: year, prefCode, type are all required',
      );
    }

    // TODO: UseCaseに移譲する
    const query = {
      year: parseInt(year, 10),
      prefectureCode: parseInt(prefectureCode, 10),
      type: parseInt(type, 10),
    };

    const result: EstateTransactionData[] =
      await this.useCase.getEstateTransactionBar(query);

    return {
      data: result,
      message: 'Estate transaction data retrieved successfully',
    };
  }
}
