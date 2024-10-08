import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductOrderService } from 'src/app/services/product-order.service';
import { NotificationsService} from 'src/app/Global/notifications.service';
import { firstValueFrom } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { RegisterService } from 'src/app/services/register.service';


@Component({
  selector: 'app-view-order-table',
  templateUrl: './view-order-table.component.html',
  styleUrls: ['./view-order-table.component.css']
})
export class ViewOrderTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  orderList = new MatTableDataSource<any>([]);
  isLoading = true;
  countOrder:any;

  displayedColumns: string[] = ['productName','imagePath','quantity', 'price', 'totalAmount','actions'];
  data: any=[];
  userId: number = 0;
  placeHolder       : string = "Search";
  searchKey         : string = "";
  userName:any;

  constructor(private router:Router,
  private orderService:ProductOrderService,
  private alert:NotificationsService,
  private users:RegisterService,
  ) {}

  ngOnInit(): void {
    this.loadUserId();
}

loadUserOrders(userId:number): void {
  this.orderService.getOrderByUserId(userId).subscribe({
    next: (data) => {
      this.countOrder = data;
      this.orderList = data;
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading user orders:', err);
      this.isLoading = true;
    }
  });
}
  // Add this method to your existing ProductItemsComponent class
  getImagePath(imagePath: string): string {
    const baseUrl = 'http://localhost:5274/api/Images/'; // Adjust this to your API base URL
    return baseUrl + imagePath; // Construct the full URL
  }

async loadUserId(): Promise<void> {
  try {
    const username = localStorage.getItem('UserName');
    this.userName = username;

    const user = await firstValueFrom(this.users.getUserByUsername(this.userName));
    this.userId = user.id; 
    this.loadUserOrders(this.userId);
    //console.log('User id:', this.userId);
  } catch (error) {
    console.error('Error fetching View Order:', error);
  }
}


  editEmployee(_t85: any) {
    throw new Error('Method not implemented.');
    }

     
  deleteEmployee(products:any){
    if(!products){
      this.alert.toastrWarning('No record selected!');
      
    }
    else{
      this.alert.popupWarning(products.productName," "+"Are you sure to delete this product?").then((result) => {
        if (result.value) {
          this.orderService.DeleteProductOrder(products.orderId).subscribe({
              next:()=>{
                this.alert.popupSwalMixin("Successfuly deleted "+ products.productName);
                this.loadUserId();
              },
              error:()=>{
                this.alert.toastrError("no product id");
                this.loadUserId();
              },
          });
        }
      });
    }
  }
    
  onBack():void {
    this.router.navigate(['header/menus/menu']); 
    }
 
    applyFilter(): void {
      this.orderList.filter = this.searchKey.trim().toLowerCase();
    }

   clearSearch(){
     this.searchKey = "";
     this.applyFilter();
 
   }
 
}
