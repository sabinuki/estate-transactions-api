import { IsNumber, Min, Max, IsIn, IsNotEmpty } from 'class-validator';
import {
  KANTO_PREFECTURES_CODES,
  TYPE,
} from '../../../use-cases/town-planning.use-case.constants';

export class GetEstateTransactionRequestDto {
  @IsNumber()
  @Min(2009, { message: 'Year must be after 2008' })
  @Max(2021, { message: 'Year must be before 2022' })
  @IsNotEmpty({ message: 'Year is required' })
  year: number;

  @IsNumber()
  @IsIn(KANTO_PREFECTURES_CODES, {
    message: 'Prefecture code must be a valid Kanto prefecture code',
  })
  @IsNotEmpty({ message: 'Prefecture code is required' })
  prefCode: number;

  @IsNumber()
  @IsIn(Object.values(TYPE), {
    message: `Type must be a valid type (${Object.values(TYPE).join(', ')})`,
  })
  @IsNotEmpty({ message: 'Type is required' })
  type: number;
}
