import {Battery} from './battery';
import {BatteryService} from '../services/battery.service';

export class DashboardFilter {
    season: enSeason = enSeason.YEAR;
    battery: Battery = BatteryService.Batteries[0];
    battery_efficency: number = 0.85;
    price_to_net: number = 0.15;
    price_from_net: number = 0.30;

    seasonFilter = (e: { Datum: Date }) => { return false; };

    constructor(obj?: any) {
        Object.assign(this, obj);

        this.seasonFilter = (e: { Datum: Date }) => {
            let filter = true;
            switch (this.season) {
              case enSeason.SUMMER23:
                filter = e.Datum >= new Date('2023-03-01') && e.Datum < new Date('2023-09-01');
                break;
              case enSeason.WINTER24:
                filter = e.Datum >= new Date('2023-09-01') && e.Datum < new Date('2024-03-01');
                break;
              case enSeason.SUMMER24:
                filter = e.Datum >= new Date('2024-03-01') && e.Datum < new Date('2024-10-01');
                break;
            }
            return filter;
        }
    }
}

export enum enSeason {
    SUMMER23 = 'Sommer23',
    WINTER24 = 'Winter24',
    SUMMER24 = 'Sommer24',
    YEAR = 'Ganzes Jahr'
}

// export const batteries: Battery[] = [
//     {caption: 'GreenCell PowerNest', capacity: 0, max: 5000, price: 1569, savings: 0},
//     {caption: 'Bluetti EP500 Powerstation EU', capacity: 0, max: 5100, price: 2830, savings: 0},
//     {caption: 'Hochvolt-Speichersystem ARK XH Kit', capacity: 0, max: 5120, price: 3422, savings: 0},
//     {caption: 'V-TAC LiFePO4-Batterie', capacity: 0, max: 6140, price: 3868, savings: 0},
//     {caption: 'Huawei LUNA2000 (10 kWh DC)', capacity: 0, max: 9000, price: 6000, savings: 0},
//     {caption: 'Growatt APX', capacity: 0, max: 10000, price: 5509, savings: 0},
//     {caption: 'BYD Battery-Box Premium (12.8 kWh DC)', capacity: 0, max: 11520, price: 9795, savings: 0},
//     {caption: 'VARTA element 12 (13 kWh)', capacity: 0, max: 11700, price: 10500, savings: 0},
//     {caption: 'Tesla Powerwall 2 (13.5 kWh)', capacity: 0, max: 12150, price: 10500, savings: 0},
//     {caption: 'LG (17.2 kWh)', capacity: 0, max: 15480, price: 6800, savings: 0},
//     {caption: 'Growatt Lithium Batterie Speicher 7 - 15 kWh', capacity: 0, max: 15300, price: 7900, savings: 0},
//     {caption: 'Growatt Lithium Batterie Speicher 7 - 18 kWh', capacity: 0, max: 17900, price: 9400, savings: 0},
//     {caption: 'Growatt Lithium Batterie Speicher 7 - 25 kWh', capacity: 0, max: 25600, price: 14900, savings: 0},
//     {caption: '10 kWh', capacity: 0, max: 10000, price: 10000, savings: 0},
//     {caption: '15 kWh', capacity: 0, max: 15000, price: 15000, savings: 0},
//     {caption: '20 kWh', capacity: 0, max: 18000, price: 20000, savings: 0},
//     {caption: '30 kWh', capacity: 0, max: 30000, price: 30000, savings: 0},
//     {caption: '50 kWh', capacity: 0, max: 50000, price: 50000, savings: 0},
//     {caption: '100 kWh', capacity: 0, max: 100000, price: 50000, savings: 0},
//     {caption: '400 kWh', capacity: 0, max: 400000, price: 100000, savings: 0},
// ];
