import { IsArray, ValidateNested } from 'class-validator';
import type { UseCaseDataType } from '../../../use-cases/types';

export class GetEstateTransactionResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  data: UseCaseDataType[];
}
