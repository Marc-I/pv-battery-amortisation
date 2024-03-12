import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import Highcharts from 'highcharts';
import {HighchartsChartModule} from 'highcharts-angular';

@Component({
    selector: 'app-areaspline',
    standalone: true,
    imports: [
        HighchartsChartModule
    ],
    templateUrl: './areaspline.component.html',
    styleUrl: './areaspline.component.scss'
})
export class AreasplineComponent implements OnInit, OnChanges {

    @Input()
    title: string;
    @Input()
    label: string[];
    @Input()
    serienames: string[];
    @Input()
    data: number[]|number[][];
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
            if (typeof this.data[0] === 'object') {
                // @ts-ignore
                this.data.forEach((e: number[], i) => {
                    this.chartOptions.series![i] = {
                        data: e,
                        name: this.serienames && this.serienames[i] ? this.serienames[i] : this.title,
                        marker: {
                            enabled: false
                        },
                        type: 'areaspline'
                    };
                });
            } else {
                this.chartOptions.series![0] = {
                    data: this.data,
                    name: this.title,
                    marker: {
                        enabled: false
                    },
                    type: 'areaspline'
                };
            }
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
            type: 'areaspline'
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
