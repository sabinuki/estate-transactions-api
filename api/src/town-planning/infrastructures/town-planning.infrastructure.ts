import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { EstateTransactionData } from '../repositories';
import type { TownPlanningRepositoryInterface } from '../repositories';

@Injectable()
export class TownPlanningInfrastructure
  implements TownPlanningRepositoryInterface
{
  private readonly jsonFilePath: string;

  constructor() {
    this.jsonFilePath = path.join(
      __dirname,
      '../../../assets/estate_transactions.json',
    );
  }

  async getEstateTransaction(query: {
    year: string;
    prefectureCode: string;
    type: string;
  }): Promise<EstateTransactionData[]> {
    try {
      const rawData = fs.readFileSync(this.jsonFilePath, 'utf-8');
      const estateTransactions = JSON.parse(rawData) as EstateTransactionData[];
      const filteredData = estateTransactions.filter((item) => {
        return (
          item.data.result.years[0].year === Number(query.year) &&
          item.data.result.prefectureCode === query.prefectureCode &&
          item.data.result.type === query.type
        );
      });

      return Promise.resolve(filteredData);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to read estate transaction data: ${error.message}`,
        );
      }
      throw new Error('Failed to read estate transaction data: Unknown error');
    }
  }
}
