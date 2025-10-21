import {
  Controller,
  Get,
  Query,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import type { TownPlanningUseCaseInterface } from '../use-cases';
import { INTERFACES, YEARS_AVAILABLE_RANGE } from '../town-planning.constants';

@Controller('api/v1/townPlanning')
export class TownPlanningController {
  constructor(
    @Inject(INTERFACES.I_USE_CASE)
    private readonly useCase: TownPlanningUseCaseInterface,
  ) {}

  @Get('estateTransaction/bar')
  async getEstateTransaction(
    @Query('year') year?: string,
    @Query('prefCode') prefectureCode?: string,
    @Query('type') type?: string,
  ) {
    if (!year || !prefectureCode || !type) {
      throw new BadRequestException(
        'Missing required query parameters: year, prefCode, type are all required',
      );
    }

    const yearNumber = Number(year);
    if (
      yearNumber < YEARS_AVAILABLE_RANGE.min ||
      yearNumber > YEARS_AVAILABLE_RANGE.max
    ) {
      throw new BadRequestException(
        'Invalid year: must be between 2009 and 2021',
      );
    }

    return this.useCase.getEstateTransaction({
      year,
      prefectureCode,
      type,
    });
  }
}
