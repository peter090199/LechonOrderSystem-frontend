import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/Global/notifications.service';
import { DecimalPipe } from '@angular/common';
import { ProductsService } from 'src/app/services/products.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProductOrderService } from 'src/app/services/product-order.service';
import { RegisterService } from 'src/app/services/register.service';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  providers: [DecimalPipe] 
})
export class ProductDetailsComponent implements OnInit {
  quantity: number = 1;
  totalAmount: number = 0;
  isLoading: boolean = true;
  userName:any;
  userId: number = 0;

  product = {
    productName: '',
    category: '',
    imagePath: '',
    price: 0,
    totalAmount: 0,
    quantity: 1
  };

  constructor(
    private dialogRef: MatDialogRef<ProductDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private decimalPipe: DecimalPipe,
    private alert: NotificationsService,
    private getProductsByID: ProductsService,
    private http: HttpClient,
    private productOrderService:ProductOrderService,
    private users:RegisterService,
  ) {}
  
  ngOnInit(): void {
    this.loadUserId();
    this.updateProduct(this.data);
  }

  // Adjust base URL from environment variables for better maintainability
  getImagePath(imgUrl: string): string {
    const baseUrl = 'http://localhost:5274/api/Images/'; // Use environment for base URL
    return baseUrl + imgUrl;
  }

  async updateProduct(data: any): Promise<void> {
    try {
      this.isLoading = true;
      // Fetch product by image name dynamically from service
      this.product = await firstValueFrom(this.getProductsByID.getproductsByImageName(data));
      
      // Recalculate total price after fetching product data
      this.totalAmount = this.product.price * this.quantity;
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching product data:', error);
      this.isLoading = false;
    }
  }

  // Method to update quantity dynamically
  updateQuantity(change: number): void {
    this.quantity = Math.max(1, this.quantity + change);  // Ensure minimum quantity is 1
    this.totalAmount = this.product.price * this.quantity;  // Recalculate total price
  }

  // Handle direct quantity input changes
  onQuantityInputChange(newQuantity: number): void {
    if (newQuantity == 0) {
      this.alert.toastrWarning("Invalid Input: Zero is not allowed!");
      return;
    }
    this.quantity = Math.max(1, newQuantity);  // Ensure minimum quantity is 1
    this.totalAmount = this.quantity * this.product.price;  // Recalculate total price
  }

  // Mock method for deleting product from cart
  deleteProduct(): void {
    alert(`Deleted ${this.product.productName} from the cart.`);
  }


userIdString:any;
async loadUserId(): Promise<void> {
  try {
    const username = localStorage.getItem('UserName');
    this.userName = username;

    const user = await firstValueFrom(this.users.getUserByUsername(this.userName));
    this.userId = user.id; 
   // console.log('User id:', this.userId);
  } catch (error) {
    console.error('Error fetching View Order:', error);
  }
}


  AddToCart(){
    const product = {
      productName: this.product.productName,
      category: this.product.category,
      imagePath: this.product.imagePath,
      price: this.product.price,
      totalAmount: this.totalAmount,
      quantity: this.quantity,
      userId: this.userId
    };

    this.productOrderService.addProductToCart(product).subscribe({
        next:(message)=>{
            message = "Order Added.";
            this.alert.toastrInfo(message);
            this.dialogRef.close();
            this.LoadCounts();

        },
        error:(err) =>{
              err="Order Failed.";
              this.alert.toastrError(err);
        }
      }
    );
  }

  notificationCount:number = 0;
  async LoadCounts(): Promise<void> {
    try {
      const username = localStorage.getItem('UserName');
      this.userName = username;
  
      const user = await firstValueFrom(this.users.getUserByUsername(this.userName));
      this.userId = user.id; 
      
      this.productOrderService.GetCountsOrderById(this.userId).subscribe({
        next: (count) => this.notificationCount = count,
        error: (error) => console.error('Error fetching order count:', error),
      });
     
    } catch (error) {
      console.error('Error fetching View Order:', error);
    }
  }

}
