import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-view-order-table',
  templateUrl: './view-order-table.component.html',
  styleUrls: ['./view-order-table.component.css']
})
export class ViewOrderTableComponent implements OnInit {
  orderList = new MatTableDataSource<any>([]);
  isLoading = false;

  displayedColumns: string[] = ['productName', 'quantity', 'price', 'total','actions'];
  employees: any;


  placeHolder       : string = "Search";
  searchKey         : string = "";
  constructor(private router:Router

  ) { }

  ngOnInit(): void {
  }

  editEmployee(_t85: any) {
    throw new Error('Method not implemented.');
    }
    deleteEmployee(_t85: any) {
    throw new Error('Method not implemented.');
    }
    
  onBack() {
    this.router.navigate(['header/menus/menu']); 
    }
  applyFilter(){
    // this.employee.filter = this.searchKey.trim().toLocaleLowerCase();
   }
   clearSearch(){
     this.searchKey = "";
     this.applyFilter();
 
   }
 
}
