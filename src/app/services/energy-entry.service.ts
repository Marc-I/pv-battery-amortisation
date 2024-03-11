import {Injectable} from '@angular/core';
import {EnergyEntry} from '../models/energy-entry';
import {ApiService} from './api.service';
import {DayEnergyEntry} from '../models/day-energy-entry';
import {MonthEnergyEntry} from '../models/month-energy-entry';

@Injectable({
  providedIn: 'root'
})
export class EnergyEntryService {

  private static _energyEntries: EnergyEntry[];

  public static DayEnergyEntries: DayEnergyEntry[] = [];
  public static MonthEnergyEntries: MonthEnergyEntry[] = [];

  constructor(private _apiService: ApiService) {
  }

  async init() {
    // load data
    const data = await this._apiService.get('data_as_json.php');
    // create objects
    let energyEntries = data.map((e: any) => new EnergyEntry(e));
    // sort by date
    energyEntries.sort((a: EnergyEntry, b: EnergyEntry) => a.Datum > b.Datum ? 1 : -1);

    // store daily data
    energyEntries
      .reduce((res: DayEnergyEntry[], value: EnergyEntry) => {
        const key = Number(value.Datum.getFullYear() + '' + (value.Datum.getMonth() + 1) + '' + value.Datum.getDate());
        if (!res[key]) {
          res[key] = new DayEnergyEntry({'Datum': value.Datum});
          EnergyEntryService.DayEnergyEntries.push(res[key]);
        }
        this._sumValues(res[key], value);
        return res;
      }, {});
    EnergyEntryService.DayEnergyEntries.forEach(this._kummulateSums);

    // store monthly data
    energyEntries
      .reduce((res: MonthEnergyEntry[], value: EnergyEntry) => {
        const key = Number(value.Datum.getFullYear() + '' + (value.Datum.getMonth() + 1));
        if (!res[key]) {
          res[key] = new MonthEnergyEntry({'Datum': value.Datum});
          EnergyEntryService.MonthEnergyEntries.push(res[key]);
        }
        this._sumValues(res[key], value);
        return res;
      }, {});
    EnergyEntryService.MonthEnergyEntries.forEach(this._kummulateSums);

    EnergyEntryService._energyEntries = energyEntries;
    console.log(energyEntries);
    console.log(EnergyEntryService.DayEnergyEntries);
    console.log(EnergyEntryService.MonthEnergyEntries);
  }

  private _sumValues = (res: DayEnergyEntry|MonthEnergyEntry, value: EnergyEntry) => {
    res.NetzSumme += value.Netz;
    res.PVSumme += value.PVErtrag;
    res.BezugSumme += value.Bezug;
    res.VerbrauchSumme += value.Verbrauch;
    res.EinspeisungSumme += value.Einspeisung;
    res.PVVerbrauchSumme += value.Verbrauch - value.Bezug;
    return res;
  };

  private _kummulateSums = (e: DayEnergyEntry|MonthEnergyEntry, i: number, a:DayEnergyEntry[]|MonthEnergyEntry[]) => {
    if (i === 0) {
      e.BezugKummulativ = e.BezugSumme;
      e.PVKummulativ = e.PVSumme;
      e.VerbrauchKummulativ = e.VerbrauchSumme;
      e.EinspeisungKummulativ = e.EinspeisungSumme;
      e.PVVerbrauchKummulativ = e.PVVerbrauchSumme;
    } else {
      e.BezugKummulativ = a[i - 1].BezugKummulativ + e.BezugSumme;
      e.PVKummulativ = a[i - 1].PVKummulativ + e.PVSumme;
      e.VerbrauchKummulativ = a[i - 1].VerbrauchKummulativ + e.VerbrauchSumme;
      e.EinspeisungKummulativ = a[i - 1].EinspeisungKummulativ + e.EinspeisungSumme;
      e.PVVerbrauchKummulativ = a[i - 1].PVVerbrauchKummulativ + e.PVVerbrauchSumme;
    }
  };

}
