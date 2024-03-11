export class MonthEnergyEntry {
  Datum: Date;
  NetzSumme: number = 0;
  PVSumme: number = 0;
  BezugSumme: number = 0;
  VerbrauchSumme: number = 0;
  PVVerbrauchSumme: number = 0;
  EinspeisungSumme: number = 0;
  BezugKummulativ: number = 0;
  PVKummulativ: number = 0;
  VerbrauchKummulativ: number = 0;
  EinspeisungKummulativ: number = 0;
  PVVerbrauchKummulativ: number = 0;

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}
