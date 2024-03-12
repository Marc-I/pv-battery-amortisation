import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DashboardFilter} from '../../models/dashboard-filter';
import {PieComponent} from '../charts/pie/pie.component';
import {EnergyEntryService} from '../../services/energy-entry.service';
import {BatteryEnergyEntry} from '../../models/battery-energy-entry';
import {BatteryEnergyDayentry} from '../../models/battery-energy-dayentry';

@Component({
  selector: 'app-full-battery-pie',
  standalone: true,
  imports: [
    PieComponent
  ],
  templateUrl: './full-battery-pie.component.html',
  styleUrl: './full-battery-pie.component.scss'
})
export class FullBatteryPieComponent implements OnChanges {

  private _filter: DashboardFilter = new DashboardFilter();
  @Input()
  filter: DashboardFilter;

  title: string = 'Batterie';
  label: string[] = ['Batterie voll', 'Batterie nicht ganz voll'];
  data: any[] = [15, 27];
  update: boolean = false;

  allEntries: BatteryEnergyEntry[];
  dayEntries: BatteryEnergyDayentry[];

  constructor() {
    this.calculation();
    this.calcValues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let battery = this._filter.battery;
    let efficency = this._filter.battery_efficency;
    // console.log(battery, changes['filter']?.currentValue?.battery)
    this._filter = new DashboardFilter(this.filter);
    if (
        changes['filter']?.currentValue?.battery != battery ||
        changes['filter']?.currentValue?.battery_efficency != efficency
    ) {
      this.calculation();
    }
    this.calcValues();
  }

  calculation() {
    let capacity = 0;
    this.allEntries = [];
    let dayEntries: any = {};
    const daysWithFullBattery: string[] = [];
    const totalDays: string[] = [];
    EnergyEntryService.EnergyEntries.forEach((e, i) => {
      let addEnergy = Math.max(0, e.PVErtrag - e.Verbrauch) * this._filter.battery_efficency;
      capacity = Math.min(capacity + addEnergy, this._filter.battery.max);
      const day = e.Datum.toLocaleDateString();
      if (totalDays.indexOf(day) < 0) {
        totalDays.push(day);
      }
      if (capacity === this._filter.battery.max) {
        if (daysWithFullBattery.indexOf(day) < 0) {
          daysWithFullBattery.push(day);
        }
      }
      capacity -= Math.min(capacity, e.Bezug);
      let bee = new BatteryEnergyEntry(e);
      bee.BatterieKapazitaet = capacity;
      this.allEntries.push(bee);

      if (!dayEntries[day]) {
        dayEntries[day] = new BatteryEnergyDayentry({ Datum: e.Datum });
      }
      dayEntries[day].BatterieKapazitaet += capacity;
      if (capacity === this._filter.battery.max) {
        dayEntries[day].WarVoll = true;
      }
    });
    this.dayEntries = Object.values(dayEntries);
  }

  calcValues() {
    this.data = [
      this.dayEntries.filter(e => e.WarVoll).length,
      this.dayEntries.filter(e => !e.WarVoll).length
    ];
    this.update = true;
  }

}
