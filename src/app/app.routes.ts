import { Routes } from '@angular/router';
import {ApiDocumentationsComponent} from './api-documentations/api-documentations.component';
import {DashboardComponent} from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'api-documentations', component: ApiDocumentationsComponent },
  { path: '**', component: DashboardComponent }
];
