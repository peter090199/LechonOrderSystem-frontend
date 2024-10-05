import { Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NotificationsService } from 'src/app/Global/notifications.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { Router } from '@angular/router';
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


  constructor(private breakpointObserver: BreakpointObserver,
    private alert:NotificationsService, private dialog : MatDialog,
    private router:Router

  ) { }
  
  notificationCount = 5; 

  pigStages = [
    { name: '1 month old piglet', imgUrl: 'assets/R.jpg' },
    { name: '3 - 6 months pig', imgUrl: 'assets/3 - 6 months pig.jpg' },
    { name: '8 - 10 months pig', imgUrl: 'assets/8 - 10 months pig.jpg' },
    { name: 'Sow', imgUrl: 'assets/Sow.jpg' },
    { name: 'Letchon', imgUrl: 'assets/Letchon.jpg' },
    { name: 'Butchered Pig', imgUrl: 'assets/R.jpg' },
    { name: 'Sow Laboring', imgUrl: 'assets/R.jpg' }
  ];

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }
  
  applyFilter(){
   // this.employee.filter = this.searchKey.trim().toLocaleLowerCase();
  }
  clearSearch(){
    this.searchKey = "";
    this.applyFilter();

  }

  ViewDetails(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '900px';
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
  loadProducts() {
    throw new Error('Method not implemented.');
  }

}
