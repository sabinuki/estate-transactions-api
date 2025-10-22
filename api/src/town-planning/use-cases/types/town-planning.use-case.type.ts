export type UseCaseDataType = {
  prefectureCode: string;
  prefectureName: string;
  type: string;
  years: {
    year: number;
    value: number;
  }[];
};
