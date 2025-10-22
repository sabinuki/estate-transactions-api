export interface TownPlanningRepositoryInterface {
  getEstateTransaction(query: {
    year: number;
    prefectureCode: number;
    type: number;
  }): Promise<EstateTransactionData[]>;
}

export interface EstateTransactionData {
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
