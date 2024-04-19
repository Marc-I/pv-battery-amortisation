import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {environment} from '../../environments/environment';

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
export class ApiDocumentationsComponent {

  public apiBaseUrl = environment.restApiServer;

  public docs = [
    {
      type: 'GET',
      url: '/ping',
      title: 'Gibt einen Ping zurück',
      description: `Gibt einen Ping in folgendem Format zurück:
{
  "response": {
    "servertime": 1713534275.931758
  }
}`,
      toggle: false
    },
    {
      type: 'GET',
      url: '/batteries',
      title: 'Gibt alle PV-Speicherbatterien zurück',
      description: `Die Speicherbatterien werden als Array zurückgegen und haben folgende Werte:

caption = Name,
capacity = aktueller Füllstand der Batterie (immer 0),
max = maximale Kapazität der Batterie,
price = Preis der Batterie in CHF,
savings = gepeicherte Energie in kWh (immer 0)


{
"response": [
    {
        "caption": "GreenCell PowerNest",
        "capacity": 0,
        "max": 5000,
        "price": 1569,
        "savings": 0
    }
  ]
}`,
      toggle: false
    },
    {
      type: 'GET',
      url: '/energy?year=2024&month=1',
      title: 'Gibt die Energiedaten eines Monats zurück',
      description: ``,
      toggle: false
    }
  ]

}
