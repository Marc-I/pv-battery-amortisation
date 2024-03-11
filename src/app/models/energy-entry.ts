export class EnergyEntry {
  Datum: Date;
  PVErtrag: number;
  Netz: number;
  Bezug: number;
  Einspeisung: number;
  Verbrauch: number;

  constructor(obj?: any) {
    Object.assign(this, obj);

    if (obj.hasOwnProperty('Datum') && typeof obj['Datum'] === 'string') {
      this.Datum = new Date(obj['Datum']);
    }

    if (obj.hasOwnProperty('PVErtrag') && typeof obj['PVErtrag'] === 'string') {
      this.PVErtrag = Number(obj['PVErtrag']);
      if (isNaN(this.PVErtrag)) { this.PVErtrag = 0; }
    }

    if (obj.hasOwnProperty('Netz') && typeof obj['Netz'] === 'string') {
      this.Netz = Number(obj['Netz']);
      if (isNaN(this.Netz)) { this.Netz = 0; }
    }

    if (obj.hasOwnProperty('Bezug') && typeof obj['Bezug'] === 'string') {
      this.Bezug = Number(obj['Bezug']);
      if (isNaN(this.Bezug)) { this.Bezug = 0; }
    }

    if (obj.hasOwnProperty('Einspeisung') && typeof obj['Einspeisung'] === 'string') {
      this.Einspeisung = Number(obj['Einspeisung']);
      if (isNaN(this.Einspeisung)) { this.Einspeisung = 0; }
    }

    if (obj.hasOwnProperty('Verbrauch') && typeof obj['Verbrauch'] === 'string') {
      this.Verbrauch = Number(obj['Verbrauch']);
      if (isNaN(this.Verbrauch)) { this.Verbrauch = 0; }
    }
  }
}
