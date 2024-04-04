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
import {FormsModule} from '@angular/forms';
import {HighConsumerComponent} from './components/high-consumer/high-consumer.component';
import {LoadingOverlayComponent} from './components/loading-overlay/loading-overlay.component';

@Component({
    selector: 'app-root',
    standalone: true,
  imports: [CommonModule, RouterOutlet, AreasplineComponent, LineComponent, PieComponent, FullBatteryPieComponent, FormsModule, HighConsumerComponent, LoadingOverlayComponent],
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

    title_vergleich = 'PV-Erzeugung und Verbrauch';
    label_vergleich: string[] = [];
    serienames_vergleich: string[] = ['Erzeugung', 'Verbrauch'];
    data_vergleich: number[][] = [];

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
        let monthentries = EnergyEntryService.MonthEnergyEntries.filter(filter);
        let dayentries = EnergyEntryService.DayEnergyEntries.filter(filter);

        this.label_vergleich = monthentries.map(e => moment(e.Datum).format('MMM YY'));
        this.data_vergleich = [
            monthentries.map(e => e.PVKummulativ / 12),
            monthentries.map(e => e.VerbrauchKummulativ / 12)
        ];

        this.data_tagnachtvergleich = [
            dayentries.filter(e => e.PVSumme > e.VerbrauchSumme).length,
            dayentries.filter(e => e.PVSumme <= e.VerbrauchSumme).length
        ];

        this.update = true;
    }

}
