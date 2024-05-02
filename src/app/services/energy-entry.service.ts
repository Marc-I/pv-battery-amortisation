import {Injectable} from '@angular/core';
import {EnergyEntry} from '../models/energy-entry';
import {ApiService} from './api.service';
import {DayEnergyEntry} from '../models/day-energy-entry';
import {MonthEnergyEntry} from '../models/month-energy-entry';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class EnergyEntryService {

  private static _energyEntries: EnergyEntry[];

  public static get EnergyEntries(): EnergyEntry[] { return this._energyEntries; }
  public static DayEnergyEntries: DayEnergyEntry[] = [];
  public static MonthEnergyEntries: MonthEnergyEntry[] = [];
  public static LastMonthEnergyEntries: EnergyEntry[] = [];

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
    EnergyEntryService.DayEnergyEntries.forEach(this._kumulateSums);

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
    EnergyEntryService.MonthEnergyEntries.forEach(this._kumulateSums);

    EnergyEntryService._energyEntries = energyEntries;
    let oneWeekAgo = moment().subtract(1, 'month');
    EnergyEntryService.LastMonthEnergyEntries = energyEntries.filter((e: EnergyEntry) => moment(e.Datum).isSameOrAfter(oneWeekAgo, 'month'));
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

  private _kumulateSums = (e: DayEnergyEntry|MonthEnergyEntry, i: number, a:DayEnergyEntry[]|MonthEnergyEntry[]) => {
    if (i === 0) {
      e.BezugKumulativ = e.BezugSumme;
      e.PVKumulativ = e.PVSumme;
      e.VerbrauchKumulativ = e.VerbrauchSumme;
      e.EinspeisungKumulativ = e.EinspeisungSumme;
      e.PVVerbrauchKumulativ = e.PVVerbrauchSumme;
    } else {
      e.BezugKumulativ = a[i - 1].BezugKumulativ + e.BezugSumme;
      e.PVKumulativ = a[i - 1].PVKumulativ + e.PVSumme;
      e.VerbrauchKumulativ = a[i - 1].VerbrauchKumulativ + e.VerbrauchSumme;
      e.EinspeisungKumulativ = a[i - 1].EinspeisungKumulativ + e.EinspeisungSumme;
      e.PVVerbrauchKumulativ = a[i - 1].PVVerbrauchKumulativ + e.PVVerbrauchSumme;
    }
  };

}
