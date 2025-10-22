import { Controller, Get, Query, Inject } from '@nestjs/common';
import type { TownPlanningUseCaseInterface } from '../use-cases';
import { INTERFACES } from '../town-planning.constants';
import { GetEstateTransactionRequestDto } from './dto/requests';
import { GetEstateTransactionResponseDto } from './dto/responses';

@Controller('api/v1/townPlanning')
export class TownPlanningController {
  constructor(
    @Inject(INTERFACES.I_USE_CASE)
    private readonly useCase: TownPlanningUseCaseInterface,
  ) {}

  @Get('estateTransaction/bar')
  async getEstateTransaction(
    @Query() query: GetEstateTransactionRequestDto,
  ): Promise<GetEstateTransactionResponseDto> {
    const result = await this.useCase.getEstateTransaction({
      year: query.year,
      prefectureCode: query.prefCode,
      type: query.type,
    });

    return {
      data: result,
    };
  }
}
