import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  get = async (path: string): Promise<any> => {
    const response = await fetch(environment.restApiServer + path);
    return await response.json();
  }
}
