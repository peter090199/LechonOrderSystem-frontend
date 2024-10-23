import { Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit,ViewEncapsulation } from '@angular/core';
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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {

  isMobile : boolean = false;
  placeHolder       : string = "Search";
  searchKey         : string = "";
  isLoading: boolean = true;
  userName:any;
  userId: number = 0;
  orderCount:Observable<number> | undefined;

  constructor(private breakpointObserver: BreakpointObserver,
    private alert:NotificationsService, private dialog : MatDialog,
    private router:Router,
    private products:ProductsService,
    private countOrder:ProductOrderService,
    private users:RegisterService,
   private notify:NotifyService
  ) {}
  
  notificationCount:number | undefined;
  pigStages:any=[];


  ngOnInit(): void {
    this.loadUserId();
    this.subscribeToOrderCount(); 
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
    });
    this.loadProducts();
   
  }

  userIdString:any;

  async loadUserId(): Promise<void> {
  try {
    const username = localStorage.getItem('UserName');
    this.userName = username;

    const user = await firstValueFrom(this.users.getUserByUsername(this.userName));
    this.userId = user.id; 
    this.updateOrderCount();
  // // Subscribe to real-time order count updates
  // this.notify.orderCount$.subscribe({
  //   next: (count) => {
  //     this.orderCount = count; // Update the order count from the observable
  //     console.log('Real-time order count:', this.orderCount);
  //   },
  //   error: (error) => console.error('Error fetching order count:', error),
  // });
    // this.notify
    // this.notify..subscribe({
    //   next: (count) => {
    //     this.notificationCount = count; // Update the notification count
    //     console.log('Real-time notification count:', this.notificationCount);
    //   },
    //   error: () => console.error('Error fetching order count:'),
    // });
   
  } catch (error) {
    console.error('Error fetching View Order:', error);
  }
}
// Method to subscribe to real-time order count
subscribeToOrderCount(): void {
  this.notify.orderCount$.subscribe({
    next: (count) => {
      this.notificationCount = count; // Update the order count from the observable
      console.log('Real-time order count:', this.notificationCount);
    },
    error: (error) => console.error('Error fetching order count:', error),
  });
}

updateOrderCount(): void {
  this.countOrder.GetCountsOrderById(this.userId).subscribe({
    next: (count) => {
      this.notify.updateOrderCount(count); // Update the notification service with the initial count
    },
    error: (error) => console.error('Error fetching order count:', error),
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
      //console.log(this.pigStages)

      this.pigStages.data = this.pigStages;
      this.isLoading = false;
  
    } catch (error) {
      console.error('Error fetching employee data:', error);
      this.isLoading = false;
    }
  }
 
  

  applyFilter(){
   this.pigStages.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  clearSearch(){
    this.searchKey = "";
    this.applyFilter();

  }

  ViewDetails(stage:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '900px';
    dialogConfig.data = stage;
    const dialogRef = this.dialog.open(ProductDetailsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       // this.loadProducts(); // Refresh the table after dialog closure
      }
    });
  }
  ViewOrder():void{
    this.router.navigate(['header/home/view-order']); 
  }
 

}
