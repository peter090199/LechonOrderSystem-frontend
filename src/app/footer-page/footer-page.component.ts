import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-page',
  templateUrl: './footer-page.component.html',
  styleUrls: ['./footer-page.component.css']
})
export class FooterPageComponent implements OnInit {
  isViewingOrder: boolean = true; // Controls if the footer should be displayed
  totalPrice: number = 0; // Holds the total price for the order
  constructor() { }

  ngOnInit(): void {
    this.ViewOrder(); 
  }

 ViewOrder(): void {
  this.totalPrice = 120.50; // Example total price
  this.isViewingOrder = true; // Show the footer when viewing order
}

checkoutOrder(): void {
  console.log('Proceed to checkout with total price:', this.totalPrice);
}


}
