import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {EnergyEntryService} from './services/energy-entry.service';
import moment from 'moment';
import {AreasplineComponent} from './components/charts/areaspline/areaspline.component';
import {LineComponent} from './components/charts/line/line.component';
import {PieComponent} from './components/charts/pie/pie.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, AreasplineComponent, LineComponent, PieComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    private _update = true;
    get update(): boolean {
        return this._update;
    }

    set update(value: boolean) {
        this._update = value;
    }

    title_einspeisung = 'Einspeisung';
    label_einspeisung: string[] = [];
    data_einspeisung: number[] = [];

    title_bezug = 'Bezug';
    label_bezug: string[] = [];
    data_bezug: number[] = [];

    title_pvertrag = 'PV Ertrag';
    label_pvertrag: string[] = [];
    data_pvertrag: number[] = [];

    title_pvverbrauch = 'Eigenverbrauch';
    label_pvverbrauch: string[] = [];
    data_pvverbrauch: number[] = [];

    title_tagnachtvergleich = 'Tage mit Überproduktion';
    label_tagnachtvergleich: string[] = ['Überproduktion', 'Unterproduktion'];
    data_tagnachtvergleich: any[] = [];

    season: string = 'Ganzes Jahr';

    constructor() {
        this.calcValues();
    }

    buttonclick(): void {
        //this.title_bezug = 'Uigure';
        //this.data_pvverbrauch = EnergyEntryService.MonthEnergyEntries.map(e => e.PVKummulativ);
        //this.update = true;
    }

    changeSeason() {
        switch (this.season) {
            case 'Ganzes Jahr': this.season = 'Sommer'; break;
            case 'Sommer': this.season = 'Winter'; break;
            case 'Winter': this.season = 'Ganzes Jahr'; break;
            default: this.season = 'Ganzes Jahr';
        }
        this.calcValues();
    }

    calcValues() {
        let monthentries = EnergyEntryService.MonthEnergyEntries;
        let dayentries = EnergyEntryService.DayEnergyEntries;
        if (this.season === 'Winter') {
            monthentries = EnergyEntryService.MonthEnergyEntries.filter((e) => {
                return e.Datum.getMonth() <= 2 || e.Datum.getMonth() >= 9;
            });
            dayentries = EnergyEntryService.DayEnergyEntries.filter((e) => {
                return e.Datum.getMonth() <= 2 || e.Datum.getMonth() >= 9;
            });
        }
        if (this.season === 'Sommer') {
            monthentries = EnergyEntryService.MonthEnergyEntries.filter((e) => {
                return e.Datum.getMonth() > 2 && e.Datum.getMonth() < 9;
            });
            dayentries = EnergyEntryService.DayEnergyEntries.filter((e) => {
                return e.Datum.getMonth() > 2 && e.Datum.getMonth() < 9;
            });
        }

        this.label_einspeisung = monthentries.map(e => moment(e.Datum).format('MMM YY'));
        this.data_einspeisung = monthentries.map(e => e.EinspeisungSumme);

        this.label_bezug = monthentries.map(e => moment(e.Datum).format('MMM YY'));
        this.data_bezug = monthentries.map(e => e.BezugSumme);

        this.label_pvertrag = monthentries.map(e => moment(e.Datum).format('MMM YY'));
        this.data_pvertrag = monthentries.map(e => e.PVSumme);

        this.label_pvverbrauch = monthentries.map(e => moment(e.Datum).format('MMM YY'));
        this.data_pvverbrauch = monthentries.map(e => e.PVVerbrauchSumme);

        this.data_tagnachtvergleich = [
            dayentries.filter(e => e.PVSumme > e.VerbrauchSumme).length,
            dayentries.filter(e => e.PVSumme <= e.VerbrauchSumme).length
        ];

        this.update = true;
    }
}
