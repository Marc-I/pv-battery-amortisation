import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DashboardFilter} from '../../models/dashboard-filter';
import {PieComponent} from '../charts/pie/pie.component';
import {EnergyEntryService} from '../../services/energy-entry.service';
import {BatteryEnergyEntry} from '../../models/battery-energy-entry';
import {BatteryEnergyDayentry} from '../../models/battery-energy-dayentry';
import {CommonModule} from '@angular/common';
import {LoadingService} from '../../services/loading.service';
import {BatteryService} from '../../services/battery.service';

@Component({
  selector: 'app-full-battery-pie',
  standalone: true,
  imports: [
    CommonModule,
    PieComponent
  ],
  templateUrl: './full-battery-pie.component.html',
  styleUrl: './full-battery-pie.component.scss'
})
export class FullBatteryPieComponent implements OnInit, OnChanges {

  private _filter: DashboardFilter = new DashboardFilter();
  @Input()
  filter: DashboardFilter;

  title: string = 'Tage mit voller Batterie';
  label: string[] = ['Batterie voll', 'Batterie nicht ganz voll'];
  data: any[] = [1, 1];
  update: boolean = false;

  dayEntries: number = 0;
  batterySavings: number;

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
    return this._batService
      .getAmortisationCalculation(this.filter.battery.max, this.filter.battery_efficency * 100)
      .then(data => {
        this.batterySavings = data.lost;
        this.dayEntries = data.days;
        this.data = [data.days_with_full_battery, data.days - data.days_with_full_battery];
        this.update = true;
      });
  }
}
