import { Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NotificationsService } from 'src/app/Global/notifications.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';

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

  constructor(private breakpointObserver: BreakpointObserver,
    private alert:NotificationsService, private dialog : MatDialog,
    private router:Router,
    private products:ProductsService

  ) { }
  
  notificationCount = 5; 
  pigStages:any=[];
  
  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
    });
    this.loadProducts();
  }
  
    getImagePath(imgUrl: string): string {
      const baseUrl = 'http://localhost:5274/api/Images/'; // Adjust this to your API base URL
      return baseUrl + imgUrl;
   }
  
  
  async loadProducts(): Promise<void> {
    try {
      this.isLoading = true;
      this.pigStages = await firstValueFrom(this.products.getEmployees());
      console.log(this.pigStages)

      this.pigStages.data = this.pigStages;
      this.isLoading = false;
  
    } catch (error) {
      console.error('Error fetching employee data:', error);
      this.isLoading = false;
    }
  }
 
  

  applyFilter(){
   // this.employee.filter = this.searchKey.trim().toLocaleLowerCase();
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
