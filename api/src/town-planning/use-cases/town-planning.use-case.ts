import { EstateTransactionData } from '../repositories';
import type { TownPlanningRepositoryInterface } from '../repositories';
import { Inject, Injectable } from '@nestjs/common';
import { INTERFACES } from '../town-planning.constants';
import { BadRequestException } from '@nestjs/common';
import {
  YEARS_VALIDATION_RANGE,
  KANTO_PREFECTURES_CODES,
  TYPE,
} from './town-planning.use-case.constants';

export interface TownPlanningUseCaseInterface {
  getEstateTransaction(query: {
    year: string;
    prefectureCode: string;
    type: string;
  }): Promise<EstateTransactionData[]>;
}

@Injectable()
export class TownPlanningUseCase implements TownPlanningUseCaseInterface {
  constructor(
    @Inject(INTERFACES.I_REPOSITORY)
    private readonly repository: TownPlanningRepositoryInterface,
  ) {}

  async getEstateTransaction(query: {
    year: string;
    prefectureCode: string;
    type: string;
  }): Promise<EstateTransactionData[]> {
    this.validateBizRules(query);

    return this.repository.getEstateTransaction(query);
  }

  private validateBizRules(query: {
    year: string;
    prefectureCode: string;
    type: string;
  }): void {
    const year = Number(query.year);
    const prefectureCode = Number(query.prefectureCode);
    const type = Number(query.type);

    if (
      year < YEARS_VALIDATION_RANGE.min ||
      year > YEARS_VALIDATION_RANGE.max
    ) {
      throw new BadRequestException('No data available for the specified year');
    }

    if (
      !KANTO_PREFECTURES_CODES.includes(
        prefectureCode as (typeof KANTO_PREFECTURES_CODES)[number],
      )
    ) {
      throw new BadRequestException(
        'No data available for the specified prefecture code',
      );
    }

    if (
      !Object.values(TYPE).includes(type as (typeof TYPE)[keyof typeof TYPE])
    ) {
      throw new BadRequestException('No data available for the specified type');
    }
  }
}
