import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {EnergyEntry} from '../models/energy-entry';
import {EnergyEntryService} from './energy-entry.service';

export function appConfigFactory(initService: InitService) {
  return (): Promise<any> => {
    return initService.init();
  }
}

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor(private _energyEntryService: EnergyEntryService) { }

  async init() {
    await this._energyEntryService.init();
  }
}
