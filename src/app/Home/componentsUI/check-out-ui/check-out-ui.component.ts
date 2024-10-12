// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-check-out-ui',
//   templateUrl: './check-out-ui.component.html',
//   styleUrls: ['./check-out-ui.component.css']
// })
// export class CheckOutUIComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

import { Component } from '@angular/core';
@Component({
  selector: 'app-check-out-ui',
  templateUrl: './check-out-ui.component.html',
  styleUrls: ['./check-out-ui.component.css']
})

export class CheckoutComponent {
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  fullName: string="";
  address: string="";
  city: string="";
  state: string="";
  zipCode: string="";

  latitude: number = 37.7749; // Default latitude (e.g., San Francisco)
  longitude: number = -122.4194; // Default longitude (e.g., San Francisco)

  onSubmit() {
    // Handle form submission
    console.log('Submitted:', {
      fullName: this.fullName,
      address: this.address,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode
    });
  }

  onMapClick(event: MouseEvent) {
    // this.latitude = event.coords.lat;
    // this.longitude = event.coords.lng;
  }
}

