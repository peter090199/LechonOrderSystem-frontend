import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ProductsService } from 'src/app/services/products.service';
import { ProductsUIComponent } from '../../componentsUI/products-ui/products-ui.component';
import { firstValueFrom } from 'rxjs';
import { NotificationsService } from 'src/app/Global/notifications.service';

@Component({
  selector: 'app-product-items',
  templateUrl: './product-items.component.html',
  styleUrls: ['./product-items.component.css']
})
export class ProductItemsComponent implements OnInit {
  displayedColumns: string[] = ['id','empID','imagePath','empName', 'address', 'contactNo', 'actions'];
  employee = new MatTableDataSource<any>([]);
  isLoading = true;
  placeHolder       : string = "Search";
  searchKey         : string = "";
  employees         : any=[];
  pageSizeOptions   : number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private employeeService: ProductsService, 
    private dialog : MatDialog,
    private notificationsService : NotificationsService
  ){
    
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  // Add this method to your existing ProductItemsComponent class
  getImagePath(imagePath: string): string {
    const baseUrl = 'http://localhost:5274/api/Images/'; // Adjust this to your API base URL
    return baseUrl + imagePath; // Construct the full URL
  }


  applyFilter(){
    this.employee.filter = this.searchKey.trim().toLocaleLowerCase();
  }
  clearSearch(){
    this.searchKey = "";
    this.applyFilter();
  }

  onClickNew(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    const dialogRef = this.dialog.open(ProductsUIComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts(); // Refresh the table after dialog closure
      }
    });
  }
  
  async loadProducts(): Promise<void> {
    try {
      this.isLoading = true;
      this.employees = await firstValueFrom(this.employeeService.getEmployees());
      console.log(this.employees)

      this.employee.data = this.employees;
      this.employee.paginator = this.paginator;
      this.employee.sort = this.sort;
      this.isLoading = false;
  
    } catch (error) {
      console.error('Error fetching employee data:', error);
      this.isLoading = false;
    }
  }
 
  deleteEmployee(employee:any){
    if(!employee){
      this.notificationsService.toastrWarning('No record selected!');
      
    }
    else{
      this.notificationsService.popupWarning(employee.empName," "+"Are you sure to delete this product?").then((result) => {
        if (result.value) {
          this.employeeService.deleteEmployee(employee.empID).subscribe({
              next:()=>{
                this.notificationsService.popupSwalMixin("Successfuly deleted "+ employee.empName);
                this.loadProducts();
              },
              error:()=>{
                this.notificationsService.toastrError("no employee id");
                this.loadProducts();
              },
          });
        }
      });
    }
  }

  editEmployee(data?: any): void {
    const dialogRef = this.dialog.open(ProductsUIComponent, {
      width: '400px',
      data: data || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }


}
