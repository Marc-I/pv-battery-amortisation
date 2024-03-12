import { Component } from '@angular/core';
import Highcharts from 'highcharts';
import {HighchartsChartModule} from 'highcharts-angular';
import {EnergyEntryService} from '../../services/energy-entry.service';

@Component({
  selector: 'app-high-consumer',
  standalone: true,
    imports: [
        HighchartsChartModule
    ],
  templateUrl: './high-consumer.component.html',
  styleUrl: './high-consumer.component.scss'
})
export class HighConsumerComponent {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title: {text: 'Grossverbraucher'},
    legend: {enabled: false},
    xAxis: [{
      categories: EnergyEntryService.LastMonthEnergyEntries.map(e => e.Datum.toLocaleDateString())
    }],
    yAxis: [{title: {text: ''}}],
    series: [
      {
        data: EnergyEntryService.LastMonthEnergyEntries.map(e => e.PVErtrag),
        type: 'areaspline'
      },
      {
        data: EnergyEntryService.LastMonthEnergyEntries.map(e => e.Verbrauch),
        type: 'areaspline'
      },
      {
        data: EnergyEntryService.LastMonthEnergyEntries.map(e => 10000),
        type: 'line',
        color: '#f00'
      },
    ]
  };

  constructor() {
  }

}
