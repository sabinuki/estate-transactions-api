import type { TownPlanningRepositoryInterface } from '../repositories';
import { Inject, Injectable } from '@nestjs/common';
import { INTERFACES } from '../town-planning.constants';
import { BadRequestException } from '@nestjs/common';
import {
  YEARS_VALIDATION_RANGE,
  KANTO_PREFECTURES_CODES,
  TYPE,
} from './town-planning.use-case.constants';
import type { UseCaseDataType } from './types';

export interface TownPlanningUseCaseInterface {
  getEstateTransaction(query: {
    year: number;
    prefectureCode: number;
    type: number;
  }): Promise<UseCaseDataType[]>;
}

@Injectable()
export class TownPlanningUseCase implements TownPlanningUseCaseInterface {
  constructor(
    @Inject(INTERFACES.I_REPOSITORY)
    private readonly repository: TownPlanningRepositoryInterface,
  ) {}

  async getEstateTransaction(query: {
    year: number;
    prefectureCode: number;
    type: number;
  }): Promise<UseCaseDataType[]> {
    this.validateBizRules(query);

    const result = await this.repository.getEstateTransaction(query);

    return result.map((item) => ({
      prefectureCode: item.data.result.prefectureCode,
      prefectureName: item.data.result.prefectureName,
      type: item.data.result.type,
      years: item.data.result.years.map((year) => ({
        year: year.year,
        value: year.value,
      })),
    }));
  }

  private validateBizRules(query: {
    year: number;
    prefectureCode: number;
    type: number;
  }): void {
    if (
      query.year < YEARS_VALIDATION_RANGE.min ||
      query.year > YEARS_VALIDATION_RANGE.max
    ) {
      throw new BadRequestException('No data available for the specified year');
    }

    if (
      !KANTO_PREFECTURES_CODES.includes(
        query.prefectureCode as (typeof KANTO_PREFECTURES_CODES)[number],
      )
    ) {
      throw new BadRequestException(
        'No data available for the specified prefecture code',
      );
    }

    if (
      !Object.values(TYPE).includes(
        query.type as (typeof TYPE)[keyof typeof TYPE],
      )
    ) {
      throw new BadRequestException('No data available for the specified type');
    }
  }
}
