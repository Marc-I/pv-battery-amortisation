import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {DashboardFilter} from '../../models/dashboard-filter';
import {BatteryEnergyEntry} from '../../models/battery-energy-entry';
import {BatteryEnergyDayentry} from '../../models/battery-energy-dayentry';
import {LoadingService} from '../../services/loading.service';
import {EnergyEntryService} from '../../services/energy-entry.service';

@Component({
  selector: 'app-battery-table',
  standalone: true,
  imports: [
    DecimalPipe
  ],
  templateUrl: './battery-table.component.html',
  styleUrl: './battery-table.component.scss'
})
export class BatteryTableComponent implements OnChanges {

  private _filter: DashboardFilter = new DashboardFilter();
  @Input()
  filter: DashboardFilter;

  title: string = 'Batterie';
  label: string[] = ['Batterie voll', 'Batterie nicht ganz voll'];
  data: any[] = [1, 1];
  update: boolean = false;

  allEntries: BatteryEnergyEntry[];
  dayEntries: BatteryEnergyDayentry[] = [];
  batterySavings: number;

  private _loadingId = 'full-battery-pie-component';

  get total(): number {
    return (
      (this.batterySavings / 1000 * this._filter.battery_efficency * this._filter.price_from_net)
      -
      (this.batterySavings / 1000 * this._filter.price_to_net)
    );
  }

  get amortisation(): number {
    return this.filter.battery.price / (this.total / this.dayEntries.length * 365);
  }

  constructor() {
    LoadingService.start_async(this._loadingId + '_constructor');
    this.calculation();
    this.calcValues();
    LoadingService.stop_async(this._loadingId + '_constructor');
  }

  ngOnChanges(changes: SimpleChanges): void {
    let battery = this._filter.battery;
    let efficency = this._filter.battery_efficency;
    this._filter = new DashboardFilter(this.filter);
    LoadingService.start_async(this._loadingId + '_changes');
    if (
      changes['filter']?.currentValue?.battery != battery ||
      changes['filter']?.currentValue?.battery_efficency != efficency
    ) {
      setTimeout(() => {
        this.calculation();
        this.calcValues();
        LoadingService.stop_async(this._loadingId + '_changes');
      }, 100);
    } else {
      this.calcValues();
      LoadingService.stop_async(this._loadingId + '_changes');
    }
  }

  calculation() {
    let capacity = 0;
    this.allEntries = [];
    let dayEntries: any = {};
    const daysWithFullBattery: string[] = [];
    const totalDays: string[] = [];
    let savedEnergy = 0;
    EnergyEntryService.EnergyEntries.forEach((e, i) => {
      let addEnergy = Math.max(0, e.PVErtrag - e.Verbrauch) / 12;
      capacity = Math.min(capacity + addEnergy * this._filter.battery_efficency, this._filter.battery.max);
      const day = e.Datum.toLocaleDateString();
      if (totalDays.indexOf(day) < 0) {
        totalDays.push(day);
      }
      if (capacity === this._filter.battery.max) {
        if (daysWithFullBattery.indexOf(day) < 0) {
          daysWithFullBattery.push(day);
        }
      }
      capacity -= Math.min(capacity, e.Bezug / 12);
      savedEnergy += Math.min(capacity, e.Bezug / 12);
      let bee = new BatteryEnergyEntry(e);
      bee.BatterieKapazitaet = capacity;
      bee.BatterieEinsparung = savedEnergy;
      this.allEntries.push(bee);

      if (!dayEntries[day]) {
        dayEntries[day] = new BatteryEnergyDayentry({Datum: e.Datum});
      }
      dayEntries[day].BatterieKapazitaet += capacity;
      if (capacity === this._filter.battery.max) {
        dayEntries[day].WarVoll = true;
      }
      dayEntries[day].BatterieEinsparung = savedEnergy;
    });
    this.dayEntries = Object.values(dayEntries);
    this.batterySavings = savedEnergy;
  }

  calcValues() {
    this.data = [
      this.dayEntries.filter(e => e.WarVoll).filter(this._filter.seasonFilter).length,
      this.dayEntries.filter(e => !e.WarVoll).filter(this._filter.seasonFilter).length
    ];
    this.update = true;
  }

}
