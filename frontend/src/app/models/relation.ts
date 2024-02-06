export interface LawClass {
  id: number;
  name: string;
  // Voeg eventuele extra eigenschappen toe die u nodig heeft
}

export enum Cardinality {
  V_1 = 'V_1',
  NV_0_1_N = 'NV_0_1_N',
  V_1_N = 'V_1_N',
  NV_0_1 = 'NV_0_1',
}

export interface Relation {
  id: number;
  mainLawClass: LawClass; // of alleen `mainLawClassId: number;` als u niet het hele object nodig heeft
  subClass: LawClass; // of alleen `subLawClassId: number;`
  cardinality: Cardinality;
  description: string;
}
