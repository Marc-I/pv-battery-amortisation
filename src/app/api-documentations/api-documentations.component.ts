import {Component, AfterContentInit, ViewChild, ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {environment} from '../../environments/environment';
import SwaggerUI from 'swagger-ui';
import spec from './openapi.json';
import {PingService} from '../services/ping.service';

@Component({
  selector: 'app-api-documentations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './api-documentations.component.html',
  styleUrl: './api-documentations.component.scss'
})
export class ApiDocumentationsComponent implements AfterContentInit {
  @ViewChild('swaggerui',{static: true}) custApiDocElement: ElementRef | undefined;

  constructor() {
    PingService.Ping();
  }

  ngAfterContentInit() {
    spec.servers[0].url = environment.restApiServer;
    const ui = SwaggerUI({
      spec: spec,
      dom_id: '#swaggerui'
    })

    // @ts-ignore
    window.ui = ui
    PingService.Ping();
  }
}
