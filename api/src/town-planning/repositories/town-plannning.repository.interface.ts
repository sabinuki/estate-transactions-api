export interface TownPlanningRepositoryInterface {
  getEstateTransaction(query: {
    year: string;
    prefectureCode: string;
    type: string;
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
