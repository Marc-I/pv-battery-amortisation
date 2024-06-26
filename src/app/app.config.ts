import {APP_INITIALIZER, ApplicationConfig} from '@angular/core';
import { provideRouter } from '@angular/router';
import {appConfigFactory, InitService} from './services/init.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: appConfigFactory,
      deps: [InitService],
      multi: true
    }
  ]
};
