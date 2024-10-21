import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-check-out-ui',
  templateUrl: './check-out-ui.component.html',
  styleUrls: ['./check-out-ui.component.css']
})

export class CheckOutUIComponent implements OnInit {

// Example: San Francisco
  zoom = 8;


  fullName: string = "";
  address: string = "";
  city: string = "";
  state: string = "";
  zipCode: string = "";

  latitude: number = 37.7749;  // Default latitude (e.g., San Francisco)
  longitude: number = -122.4194;  // Default longitude (e.g., San Francisco)

  step = 0;


  mobileNumber = new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]{11}$'),  // Regex updated to validate 11-digit numbers
  ]);

  isValid() {
    return this.mobileNumber.valid;
  }


  constructor() {}

  ngOnInit(): void {
   // this.initMap();
  }
  
  // async initMap(): Promise<void> {
  //   const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  //   const map = new Map(document.getElementById("map") as HTMLElement, {
  //     center: this.center,
  //     zoom: this.zoom,
  //   });

  //   // Add click event listener to the map
  //   map.addListener('click', (event: google.maps.MapMouseEvent) => {
  //     this.onMapClick(event);
  //   });
  // }

    // onMapClick(event: google.maps.MapMouseEvent) {
    //   if (event.latLng) {
    //     this.selectedLocation = {
    //       lat: event.latLng.lat(),
    //       lng: event.latLng.lng(),
    //     };
    //     console.log('Selected Location:', this.selectedLocation);
    //   }
    // }


  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
   
  }

  prevStep() {
    this.step--;
  }

  // Handle form submission
  onSubmit() {
    console.log('Submitted:', {
      fullName: this.fullName,
      address: this.address,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      latitude: this.latitude,
      longitude: this.longitude,

    });
  }
}
