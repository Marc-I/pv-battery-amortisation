import {Component, EventEmitter, Inject, Injectable} from '@angular/core';
import {v4 as uuidv4} from 'uuid';
import {timestamp} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private static _loadingTasks: string[] = [];

  static loadingEmitter = new EventEmitter<boolean>();

  static get loading(): boolean {
    return this._loadingTasks.length > 0;
  }

  static start(id?: string): string {
    const _id = id ?? uuidv4();

    if (this._loadingTasks.indexOf(_id) < 0) {
      this._loadingTasks.push(_id);
    }
    this.loadingEmitter.emit(this.loading);

    return _id;
  }

  static start_async(id: string): void {
    setTimeout(() => {
      this.start(id);
    }, 0);
  }

  static stop(id: string) {
    this._loadingTasks.splice(this._loadingTasks.indexOf(id), 1);
    this.loadingEmitter.emit(this.loading);
  }

  static stop_async(id: string): void {
    setTimeout(() => {
      this.stop(id);
    }, 0);
  }
}
