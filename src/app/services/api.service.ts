import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Request} from '../models/request';
import {iResponse} from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  get = async (path: string): Promise<any> => {
    const response = await fetch(environment.restApiServer + path);
    return await response.json();
  }

  post = async <T, U>(path: string, data: T): Promise<iResponse<T, U>> => {
    const request = new Request<T>(data);
    const response = await fetch(environment.restApiServer + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });
    console.log('request', request);
    const result: iResponse<T, U> = await response.json();
    result.frontendEnd = Date.now();
    return result;
  }
}
