import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {EnergyEntry} from '../models/energy-entry';
import {EnergyEntryService} from './energy-entry.service';
import {BatteryService} from './battery.service';

export function appConfigFactory(initService: InitService) {
  return (): Promise<any> => {
    return initService.init();
  }
}

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor(private _energyEntryService: EnergyEntryService, private _batteryService: BatteryService) { }

  async init() {
    await this._energyEntryService.init();
    await this._batteryService.init();
  }
}
