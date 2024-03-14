import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import Highcharts from 'highcharts';
import {HighchartsChartModule} from 'highcharts-angular';
import {EnergyEntryService} from '../../services/energy-entry.service';
import {DashboardFilter} from '../../models/dashboard-filter';
import {PieComponent} from '../charts/pie/pie.component';

@Component({
  selector: 'app-high-consumer',
  standalone: true,
  imports: [
    HighchartsChartModule,
    PieComponent
  ],
  templateUrl: './high-consumer.component.html',
  styleUrl: './high-consumer.component.scss'
})
export class HighConsumerComponent implements OnChanges {

  private _filter: DashboardFilter = new DashboardFilter();
  @Input()
  filter: DashboardFilter;

  update: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      zooming: {
        type: 'x'
      }
    },
    title: {text: 'Grossverbraucher'},
    legend: {enabled: true},
    xAxis: [{
      categories: EnergyEntryService.LastMonthEnergyEntries.map(e => e.Datum.toLocaleDateString())
    }],
    yAxis: [{title: {text: ''}}],
    series: [
      {
        data: EnergyEntryService.LastMonthEnergyEntries.map(e => e.PVErtrag),
        type: 'areaspline',
        name: 'PV-Ertrag'
      },
      {
        data: EnergyEntryService.LastMonthEnergyEntries.map(e => e.Verbrauch),
        type: 'areaspline',
        name: 'Verbrauch'
      },
      {
        data: EnergyEntryService.LastMonthEnergyEntries.map(e => 10000),
        type: 'line',
        color: '#f00',
        name: '10 kWh Linie'
      },
      {
        data: [],
        type: 'areaspline',
        color: '#9f9'
      }
    ]
  };

  constructor() {
    setTimeout(() => {
      this.calculation();
      }, 10);
  }

  ngOnChanges(changes: SimpleChanges): void {
    let battery = this._filter.battery;
    let efficency = this._filter.battery_efficency;
    this._filter = new DashboardFilter(this.filter);
    if (
      changes['filter']?.currentValue?.battery != battery ||
      changes['filter']?.currentValue?.battery_efficency != efficency
    ) {
      setTimeout(() => {
        this.calculation();
        }, 100);
    }
  }

  calculation() {
    const data: number[] = [];
    let capacity = 0;
    EnergyEntryService.LastMonthEnergyEntries.forEach((e) => {
      let addEnergy = Math.max(0, e.PVErtrag - e.Verbrauch) / 12;
      capacity = Math.min(capacity + addEnergy * this._filter.battery_efficency, this._filter.battery.max);
      capacity -= Math.min(capacity, e.Bezug / 12);
      data.push(capacity);
    });
    this.chartOptions.series![3] = {
      data,
      type: 'areaspline',
      color: '#9f9',
      name:'Batterie-Auslastung'
    };
    this.update = true;
  }

}
