import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {EnergyEntryService} from './services/energy-entry.service';
import moment from 'moment';
import {AreasplineComponent} from './components/charts/areaspline/areaspline.component';
import {LineComponent} from './components/charts/line/line.component';
import {PieComponent} from './components/charts/pie/pie.component';
import {BoxplotComponent} from './components/charts/boxplot/boxplot.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, AreasplineComponent, LineComponent, PieComponent, BoxplotComponent],
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
    label_einspeisung = EnergyEntryService.MonthEnergyEntries.map(e => moment(e.Datum).format('MMM YY'));
    data_einspeisung = EnergyEntryService.MonthEnergyEntries.map(e => e.EinspeisungSumme);

    title_bezug = 'Bezug';
    label_bezug = EnergyEntryService.MonthEnergyEntries.map(e => moment(e.Datum).format('MMM YY'));
    data_bezug = EnergyEntryService.MonthEnergyEntries.map(e => e.BezugSumme);

    title_pvertrag = 'PV Ertrag';
    label_pvertrag = EnergyEntryService.MonthEnergyEntries.map(e => moment(e.Datum).format('MMM YY'));
    data_pvertrag = EnergyEntryService.MonthEnergyEntries.map(e => e.PVSumme);

    title_pvverbrauch = 'Eigenverbrauch';
    label_pvverbrauch = EnergyEntryService.MonthEnergyEntries.map(e => moment(e.Datum).format('MMM YY'));
    data_pvverbrauch = EnergyEntryService.MonthEnergyEntries.map(e => e.PVVerbrauchSumme);

    title_batterie = 'Box-Plot';
    label_batterie = ['1', '2', '3', '4', '5'];
    data_batterie = [
        [760, 801, 848, 895, 965],
        [733, 853, 939, 980, 1080],
        [714, 762, 817, 870, 918],
        [724, 802, 806, 871, 950],
        [834, 836, 864, 882, 910]
    ];

    constructor() {
    }

    buttonclick(): void {
        //this.title_bezug = 'Uigure';
        //this.data_pvverbrauch = EnergyEntryService.MonthEnergyEntries.map(e => e.PVKummulativ);
        //this.update = true;
    }
}
