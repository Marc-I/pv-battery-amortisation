import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {LoadingService} from '../../services/loading.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss'
})
export class LoadingOverlayComponent implements OnInit, OnDestroy {
  loading = LoadingService.loading;
  private _loadingSubscription: Subscription;

  constructor() {
  }

  ngOnInit() {
    this._loadingSubscription = LoadingService.loadingEmitter.subscribe((value: boolean) => {
      this.loading = value;
    });
  }

  ngOnDestroy() {
    this._loadingSubscription.unsubscribe();
  }
}
