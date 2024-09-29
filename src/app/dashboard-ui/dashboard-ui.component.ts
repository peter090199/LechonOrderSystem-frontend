import { Component, OnInit } from '@angular/core';
import { slideUpDownAnimation } from '../animation';

@Component({
  selector: 'app-dashboard-ui',
  templateUrl: './dashboard-ui.component.html',
  styleUrls: ['./dashboard-ui.component.css'],
  animations:[slideUpDownAnimation]
})
export class DashboardUiComponent implements OnInit {

  constructor() { }

  getAnimationDelay(id: string): string {
    const delays: { [key: string]: string } = {
      'mat-card1': '0.1s',
      'mat-card2': '0.5s',
      'mat-card3': '1s'
    };
    return delays[id] || '0s'; // Default to '0s' if id is not found
  }

  ngOnInit(): void {
    // Any initialization logic goes here
  }
}
