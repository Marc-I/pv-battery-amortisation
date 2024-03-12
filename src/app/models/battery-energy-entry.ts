export class BatteryEnergyEntry {
  Datum: Date;
  PVErtrag: number;
  Netz: number;
  Bezug: number;
  Einspeisung: number;
  Verbrauch: number;
  BatterieKapazitaet: number;
  BatterieEinsparung: number;

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}
