import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import Highcharts from 'highcharts';
import {HighchartsChartModule} from 'highcharts-angular';

@Component({
  selector: 'app-pie',
  standalone: true,
  imports: [
    HighchartsChartModule
  ],
  templateUrl: './pie.component.html',
  styleUrl: './pie.component.scss'
})
export class PieComponent implements OnInit, OnChanges {

  @Input()
  title: string;
  @Input()
  label: string[];
  @Input()
  data: number[];
  @Input()
  update: boolean;
  @Output()
  updateChange = new EventEmitter<boolean>();

  private _updateFlag = false;
  get updateFlag(): boolean {
    return this._updateFlag;
  }

  set updateFlag(value: boolean) {
    if (value) {
      this.chartOptions.title!.text = this.title;
      // @ts-ignore
      this.chartOptions.xAxis![0].categories = this.label;
      this.chartOptions.series![0] = {
        name: 'Anzahl',
        data: this.data.map((e, i) => {
          return {
            name: this.label[i],
            y: e
          };
        }),
        dataLabels: [
          {
            enabled: true,
            distance: -20,
            format: '{point.percentage:.2f}%',
            filter: {
              operator: '>',
              property: 'percentage',
              value: 10
            }
          }
        ],
        type: 'pie'
      };
    }
    this.updateChange.emit(value);
    this._updateFlag = value;
  }

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title: {text: ''},
    legend: {enabled: false},
    xAxis: [{categories: []}],
    yAxis: [{title: {text: ''}}],
    series: [{
      data: [],
      dataLabels: [{enabled: false}],
      type: 'pie'
    }]
  };

  ngOnInit(): void {
    // this.updateFlag = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('update') && changes['update'].currentValue) {
      this.updateFlag = changes['update'].currentValue;
    }
  }

}
