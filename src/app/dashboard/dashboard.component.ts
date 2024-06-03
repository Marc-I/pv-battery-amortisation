import {Component, OnInit} from '@angular/core';
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
import {LoadingService} from '../services/loading.service';
import {dirname} from '@angular/compiler-cli';

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
export class DashboardComponent implements OnInit {
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
  data_vergleich: number[][] = [[], []];

  title_tagnachtvergleich = 'Tage mit Überproduktion';
  label_tagnachtvergleich: string[] = ['Überproduktion', 'Unterproduktion'];
  data_tagnachtvergleich: any[] = [1, 1];

  constructor(private _energyService: EnergyEntryService) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.changeSeasonSelect().then();
    }, 10);
  }

  season: enSeason = enSeason.YEAR;

  async changeSeasonSelect() {
    LoadingService.start_async(this.constructor.name + '_changes');
    this.filter.season = this.season;
    this.filter = new DashboardFilter(this.filter);
    await this.calcValues();
    this.update = true;
    LoadingService.stop_async(this.constructor.name + '_changes');
  }

  changeBattery() {
    this.filter = new DashboardFilter(this.filter);
  }

  async calcValues() {
    let monthentries = EnergyEntryService.MonthEnergyEntries.filter(this.filter.seasonFilter);

    this.label_vergleich = monthentries.map(e => moment(e.Datum).format('MMM YY'));
    this.data_vergleich = [
      monthentries.map(e => e.PVKumulativ / 12),
      monthentries.map(e => e.VerbrauchKumulativ / 12)
    ];

    const production = await this._energyService.getOverproduction(this.filter.season);
    this.data_tagnachtvergleich = [production.overproduction, production.underproduction];
  }
}
