import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/Global/notifications.service';
import { DecimalPipe } from '@angular/common';
import { ProductsService } from 'src/app/services/products.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  providers: [DecimalPipe] 
})
export class ProductDetailsComponent implements OnInit {

  // Product Information

  product:any;
  quantity: number = 0;
  totalPrice: number = 0;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ProductDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private decimalPipe: DecimalPipe,
    private alert:NotificationsService,
    private getProductsByID:ProductsService
  ) {
  }
  




  ngOnInit(): void {

    this.updateProduct(this.data);
    //console.log(this.data)
   //this.formattedValue();
  }

  getImagePath(imgUrl: string): string {
    const baseUrl = 'http://localhost:5274/api/Images/'; // Adjust this to your API base URL
    return baseUrl + imgUrl;
 }

  isLoading:boolean =true;
  async updateProduct(data: any): Promise<void> {
    try {
      this.isLoading = true;
    
      // Correctly call the getProductsByImageName method
      this.product = await firstValueFrom(this.getProductsByID.getproductsByImageName(data));
      this.isLoading = false;
    
    } catch (error) {
      console.error('Error fetching product data:', error);
      this.isLoading = false;
    }
  }
  
  
  // formattedValue(): string {
  //   return this.decimalPipe.transform(this.product.contactNo, '1.2-2') ?? '0.00';
  // }
  
// // Method to handle quantity increment/decrement
// updateQuantity2(change: number): void {
 
//   // Update quantity
//   this.quantity = Math.max(1, this.product.contactNo + change);
  
//   // Calculate the price based on the updated quantity
//   this.product.contactNo = (this.product.contactNo * this.quantity);
// }

updateQuantity(change: number): void {
  // Ensure the quantity cannot be less than 1
  this.quantity = Math.max(1, this.quantity + change);
  this.totalPrice = this.product.contactNo * this.quantity;
}

// Method to handle direct input changes
onQuantityInputChange(newQuantity: number): void {
  if(newQuantity == 0)
  {
    this.alert.toastrWarning("Invalid Input Zero!")
    return;

  }
  this.quantity = Math.max(1, newQuantity);
  this.totalPrice = this.quantity * (this.product.contactNo);
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
