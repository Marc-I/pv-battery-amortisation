import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {DashboardFilter} from '../../models/dashboard-filter';
import {BatteryEnergyEntry} from '../../models/battery-energy-entry';
import {BatteryEnergyDayentry} from '../../models/battery-energy-dayentry';
import {LoadingService} from '../../services/loading.service';
import {EnergyEntryService} from '../../services/energy-entry.service';
import {BatteryService} from '../../services/battery.service';

@Component({
  selector: 'app-battery-table',
  standalone: true,
  imports: [
    DecimalPipe
  ],
  templateUrl: './battery-table.component.html',
  styleUrl: './battery-table.component.scss'
})
export class BatteryTableComponent implements OnInit, OnChanges {

  private _filter: DashboardFilter = new DashboardFilter();
  @Input()
  filter: DashboardFilter;

  title: string = 'Batterie';
  label: string[] = ['Batterie voll', 'Batterie nicht ganz voll'];
  data: any[] = [1, 1];
  update: boolean = false;

  dayEntries: number = 0;
  batterySavings: number;

  get total(): number {
    return (
      (this.batterySavings / 1000 * this._filter.battery_efficency * this._filter.price_from_net)
      -
      (this.batterySavings / 1000 * this._filter.price_to_net)
    );
  }

  get amortisation(): number {
    return this.filter.battery.price / (this.total / this.dayEntries * 365);
  }

  constructor(private _batService: BatteryService) {}

  ngOnInit() {
    LoadingService.start_async(this.constructor.name + '_init');
    this.calculation().then(() => {
      LoadingService.stop_async(this.constructor.name + '_init');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    let battery = this._filter.battery;
    let efficency = this._filter.battery_efficency;
    this._filter = new DashboardFilter(this.filter);
    LoadingService.start_async(this.constructor.name + '_changes');
    if (
      changes['filter']?.currentValue?.battery != battery ||
      changes['filter']?.currentValue?.battery_efficency != efficency
    ) {
      this.calculation()?.then(() => {
        LoadingService.stop_async(this.constructor.name + '_changes');
      });
    } else {
      LoadingService.stop_async(this.constructor.name + '_changes');
    }
  }

  calculation() {
    if (!this.filter || !this.filter.battery) {
      return new Promise(() => {});
    }
    return this._batService
      .getAmortisationCalculation(this.filter.battery.max, this.filter.battery_efficency * 100)
      .then(data => {
        this.batterySavings = data.lost;
        this.dayEntries = data.days;
        this.update = true;
      });
  }

}
