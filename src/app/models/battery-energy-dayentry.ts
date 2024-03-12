export class BatteryEnergyDayentry {
  Datum: Date;
  WarVoll: boolean = false;
  BatterieKapazitaet: number = 0;
  BatterieEinsparung: number = 0;

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}
