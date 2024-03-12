import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {EnergyEntryService} from './services/energy-entry.service';
import moment from 'moment';
import {AreasplineComponent} from './components/charts/areaspline/areaspline.component';
import {LineComponent} from './components/charts/line/line.component';
import {PieComponent} from './components/charts/pie/pie.component';
import {FullBatteryPieComponent} from './components/full-battery-pie/full-battery-pie.component';
import {batteries, DashboardFilter, enSeason} from './models/dashboard-filter';
import {Battery} from './models/battery';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, AreasplineComponent, LineComponent, PieComponent, FullBatteryPieComponent],
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

    filter: DashboardFilter = new DashboardFilter();
    batteries: Battery[] = batteries;

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

    constructor() {
        this.calcValues();
    }

    changeSeason() {
        switch (this.filter.season) {
            case enSeason.YEAR: this.filter.season = enSeason.SUMMER; break;
            case enSeason.SUMMER: this.filter.season = enSeason.WINTER; break;
            case enSeason.WINTER: this.filter.season = enSeason.YEAR; break;
            default: this.filter.season = enSeason.YEAR;
        }
        this.calcValues();
        this.filter = new DashboardFilter(this.filter);
    }

    changeBattery() {
        this.filter = new DashboardFilter(this.filter);
    }

    calcValues() {
        let filter = (e: { Datum: Date }) => true;
        if (this.filter.season === enSeason.WINTER) {
            filter = (e: { Datum: Date }) => e.Datum.getMonth() <= 2 || e.Datum.getMonth() >= 9;
        }
        if (this.filter.season === enSeason.SUMMER) {
            filter = (e: { Datum: Date }) => e.Datum.getMonth() > 2 && e.Datum.getMonth() < 9;
        }
        let monthentries = EnergyEntryService.MonthEnergyEntries.filter(this.filter.seasonFilter);
        let dayentries = EnergyEntryService.DayEnergyEntries.filter(filter);

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
