import { Component } from '@angular/core';
import {AreasplineComponent} from '../components/charts/areaspline/areaspline.component';
import {BatteryTableComponent} from '../components/battery-table/battery-table.component';
import {FullBatteryPieComponent} from '../components/full-battery-pie/full-battery-pie.component';
import {HighConsumerComponent} from '../components/high-consumer/high-consumer.component';
import {LoadingOverlayComponent} from '../components/loading-overlay/loading-overlay.component';
import {DecimalPipe, NgForOf} from '@angular/common';
import {PieComponent} from '../components/charts/pie/pie.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DashboardFilter, enSeason} from '../models/dashboard-filter';
import {Battery} from '../models/battery';
import {EnergyEntryService} from '../services/energy-entry.service';
import moment from 'moment/moment';
import {RouterLink} from '@angular/router';
import {BatteryService} from '../services/battery.service';

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
    RouterLink,
    DecimalPipe
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
  batteries: Battery[] = BatteryService.Batteries;

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

  changeBattery() {
    this.filter = new DashboardFilter(this.filter);
  }

  calcValues() {
    let monthentries = EnergyEntryService.MonthEnergyEntries.filter(this.filter.seasonFilter);
    let dayentries = EnergyEntryService.DayEnergyEntries.filter(this.filter.seasonFilter);

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
