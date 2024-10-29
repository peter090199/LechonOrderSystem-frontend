import { Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewEncapsulation,OnDestroy  } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NotificationsService } from 'src/app/Global/notifications.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { ProductOrderService } from 'src/app/services/product-order.service';
import { RegisterService } from 'src/app/services/register.service';
import { NotifyService } from 'src/app/SignalHub/notify.service';
import { CartService } from 'src/app/service/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit,OnDestroy{

  private cartCountSubscription: Subscription | undefined;
  
  isMobile: boolean = false;
  placeHolder: string = "Search";
  searchKey: string = "";
  isLoading: boolean = true;
  userName: any;
  userId: number = 0;
  orderCount: Observable<number> | undefined;

  constructor(private breakpointObserver: BreakpointObserver,
              private alert: NotificationsService,
              private dialog: MatDialog,
              private router: Router,
              private products: ProductsService,
              private countOrder: ProductOrderService,
              private users: RegisterService,
              private notify: NotifyService,
              private cartService: CartService) {}
  

  cartItemCount: number = 0;
  pigStages: any = [];
  cartItemCount1: any = [];

  ngOnInit(): void {
    this.loadUserId();
    this.loadProducts();
    this.subscribeToOrderCountUpdates(); // Subscribe to order count updates
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.cartCountSubscription) {
      this.cartCountSubscription.unsubscribe();
    }
  }

  userIdString: any;

  async loadUserId(): Promise<void> {
    try {
      const username = localStorage.getItem('UserName');
      this.userName = username;

      const user = await firstValueFrom(this.users.getUserByUsername(this.userName));
      this.userId = user.id; 
      // this.cartService.cartCount$.subscribe(count => {
      // this.cartItemCount = count;
      // console.log(this.cartItemCount)
      // });
      this.updateOrderCount(); // Initial order count update
    } catch (error) {
      console.error('Error fetching View Order:', error);
    }
  }
  // updateOrderCount(count: number) {
  //   this.notify.updateOrderCount(count);
  // }
  updateOrderCount(): void {
    this.countOrder.getCountsOrderById(this.userId).subscribe({
      next: (count) => {
        this.notify.updateOrderCount(count); // Update the notification service with the initial count
      },
      error: (error) => console.error('Error fetching order count:', error),
    });
  }

  subscribeToOrderCountUpdates(): void {
    this.notify.orderCount$.subscribe(count => {
      this.cartItemCount = count; // Update local cart item count from the notification service
      console.log('Updated cart item count:', count);
    });
  }

  getImagePath(imgUrl: string): string {
    const baseUrl = 'http://localhost:5274/api/Images/'; // Adjust this to your API base URL
    return baseUrl + imgUrl;
  }

  async loadProducts(): Promise<void> {
    try {
      this.isLoading = true;
      this.pigStages = await firstValueFrom(this.products.getEmployees());
      this.pigStages.data = this.pigStages;

      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching employee data:', error);
      this.isLoading = false;
    }
  }

  applyFilter() {
    this.pigStages.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  clearSearch() {
    this.searchKey = "";
    this.applyFilter();
  }

  ViewDetails(stage: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '900px';
    dialogConfig.data = stage;
    const dialogRef = this.dialog.open(ProductDetailsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Optionally refresh the products after the dialog closes
        this.loadProducts();
      }
    });
  }

  ViewOrder(): void {
    this.router.navigate(['header/home/view-order']); 
  }
}