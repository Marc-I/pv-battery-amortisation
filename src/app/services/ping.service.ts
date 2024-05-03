import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {iPing} from '../models/ping';


@Injectable({
  providedIn: 'root'
})
export class PingService {

  public static Ping() {
    const apiService = new ApiService();
    apiService.post<null, iPing>('ping', null).then(e => {
      console.log('service', e);
      console.log('Server:', (e.backendEnd - e.backendStart).toFixed(3));
      console.log('Server:', ((e.frontendEnd - e.frontendStart) / 1000).toFixed(3));
    });
  }
}
