import { Component } from '@angular/core';
import {AreasplineComponent} from '../components/charts/areaspline/areaspline.component';
import {BatteryTableComponent} from '../components/battery-table/battery-table.component';
import {FullBatteryPieComponent} from '../components/full-battery-pie/full-battery-pie.component';
import {HighConsumerComponent} from '../components/high-consumer/high-consumer.component';
import {LoadingOverlayComponent} from '../components/loading-overlay/loading-overlay.component';
import {NgForOf} from '@angular/common';
import {PieComponent} from '../components/charts/pie/pie.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DashboardFilter, enSeason, batteries} from '../models/dashboard-filter';
import {Battery} from '../models/battery';
import {EnergyEntryService} from '../services/energy-entry.service';
import moment from 'moment/moment';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    AreasplineComponent,
    BatteryTableComponent,
    FullBatteryPieComponent,
    HighConsumerComponent,
    LoadingOverlayComponent,
    NgForOf,
    PieComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
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

  season: enSeason = enSeason.YEAR;
  changeSeasonSelect() {
    this.filter.season = this.season;
    this.calcValues();
    this.filter = new DashboardFilter(this.filter);
  }
  // changeSeason() {
  //     switch (this.filter.season) {
  //         case enSeason.YEAR: this.filter.season = enSeason.SUMMER; break;
  //         case enSeason.SUMMER: this.filter.season = enSeason.WINTER; break;
  //         case enSeason.WINTER: this.filter.season = enSeason.YEAR; break;
  //         default: this.filter.season = enSeason.YEAR;
  //     }
  //     this.calcValues();
  //     this.filter = new DashboardFilter(this.filter);
  // }

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
      monthentries.map(e => e.PVKumulativ / 12),
      monthentries.map(e => e.VerbrauchKumulativ / 12)
    ];

    this.data_tagnachtvergleich = [
      dayentries.filter(e => e.PVSumme > e.VerbrauchSumme).length,
      dayentries.filter(e => e.PVSumme <= e.VerbrauchSumme).length
    ];

    this.update = true;
  }
}
