export class DayEnergyEntry {
  Datum: Date;
  NetzSumme: number = 0;
  PVSumme: number = 0;
  BezugSumme: number = 0;
  VerbrauchSumme: number = 0;
  PVVerbrauchSumme: number = 0;
  EinspeisungSumme: number = 0;
  BezugKumulativ: number = 0;
  PVKumulativ: number = 0;
  VerbrauchKumulativ: number = 0;
  EinspeisungKumulativ: number = 0;
  PVVerbrauchKumulativ: number = 0;

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}
