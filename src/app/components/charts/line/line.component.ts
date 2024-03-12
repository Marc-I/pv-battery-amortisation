import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import Highcharts from 'highcharts';
import {HighchartsChartModule} from 'highcharts-angular';

@Component({
    selector: 'app-line',
    standalone: true,
    imports: [
        HighchartsChartModule
    ],
    templateUrl: './line.component.html',
    styleUrl: './line.component.scss'
})
export class LineComponent implements OnInit, OnChanges {

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
    get updateFlag(): boolean { return this._updateFlag; }
    set updateFlag(value: boolean) {
        if (value) {
            this.chartOptions.title!.text = this.title;
            // @ts-ignore
            this.chartOptions.xAxis![0].categories = this.label;
            this.chartOptions.series![0] = {
                data: this.data,
                name: this.title,
                marker: {
                    enabled: false
                },
                type: 'line'
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
            type: 'line'
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
