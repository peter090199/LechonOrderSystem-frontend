import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/Global/notifications.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  providers: [DecimalPipe] 
})
export class ProductDetailsComponent implements OnInit {

  // Product Information

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ProductDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private decimalPipe: DecimalPipe,
    private alert:NotificationsService
  ) {}
  

  Price: number = 10000;


  product = {
    name: 'Nike Socks Basketball Socks NB A Sport Elite Socks Iconic',
    variations: 'yellow, purple',
    originalPrice: 219,
    salePrice: this.Price,
    quantity: 1
  };


  ngOnInit(): void {
    this.formattedValue();
  }

  
  formattedValue(): string {
    return this.decimalPipe.transform(this.Price, '1.2-2') ?? '0.00';
  }
  
// Method to handle quantity increment/decrement
updateQuantity(change: number): void {
  // Update quantity
  this.product.quantity = Math.max(1, this.product.quantity + change);
  
  // Calculate the price based on the updated quantity
  this.Price = this.product.quantity * (this.product.salePrice || this.product.originalPrice);
}
// Method to handle direct input changes
onQuantityInputChange(newQuantity: number): void {
  if(newQuantity == 0)
  {
    this.alert.toastrWarning("Invalid Input Zero!")
    return;

  }
  this.product.quantity = Math.max(1, newQuantity);
  this.Price = this.product.quantity * (this.product.salePrice || this.product.originalPrice);
}

  
  deleteProduct(): void {
    alert(`Deleted ${this.product.name} from the cart.`);
  }

  // Function to find similar products
  findSimilar(): void {
    alert(`Finding similar products to ${this.data.name}...`);
  }
  cart = 1;
  AddToCart():void{
    console.log(this.cart)
    this.alert.toastrInfo("Successfully Add Order")
  }
}
