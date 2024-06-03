import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Battery} from '../models/battery';
import {AmortisationCalculation} from '../models/amortisation-calculation';

@Injectable({
  providedIn: 'root'
})
export class BatteryService {

  private static _batteries: Battery[];
  public static get Batteries(): Battery[] {
    return this._batteries;
  }

  constructor(private _apiService: ApiService) {
  }

  async init() {
    const data = await this._apiService.get('batteries');
    BatteryService._batteries = data.response;
  }

  async getAmortisationCalculation(capacity: number, efficency: number): Promise<AmortisationCalculation> {
    const data = await this._apiService.get(`batteries/${capacity}/${efficency}`);
    return data.response;
  }
}
