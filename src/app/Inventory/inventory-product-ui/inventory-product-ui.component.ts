import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { AccessrightsService } from 'src/app/services/accessrights.service';
import { firstValueFrom } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { NotificationsService } from 'src/app/Global/notifications.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddMenuUIComponent } from 'src/app/Users/componentsUI/add-menu-ui/add-menu-ui.component';
import { MenusService } from 'src/app/services/menus.service';
import { ProductsService } from 'src/app/services/products.service';
import { HttpClient } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';
import { _url } from 'src/global-variables';

@Component({
  selector: 'app-inventory-product-ui',
  templateUrl: './inventory-product-ui.component.html',
  styleUrls: ['./inventory-product-ui.component.css']
})

export class InventoryProductUIComponent implements OnInit {

  placeHolder       : string = "Search";
  searchKey         : string = "";
  showIdColumn = false;
  pageSizeOptions1: number[] = [5, 10, 25, 100];
  pageSizeOptions2: number[] = [5, 10, 25, 100];
  pageSizeOptions3: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = ['id'];
  
  addedColumns: string[] = [    
    'productName','category'
  ];
  
  displayedColumns2: string[] = ['productName', 'category','quantity'];
  addedColumns2: string[] = [    
    'Actions',
  ];
  mergeColumns: string[] = ['select', 'productName', 'category','quantity'];

//  mergeColumns: any = this.displayedColumns.concat(this.addedColumns);
 mergeColumns2: any = this.displayedColumns2.concat(this.addedColumns2);

  isLoading :boolean = true;
  ongoingProducts: any[] = [];
  errorMessage: string | null = null;
  
  cntOngoing: any;
  products = new MatTableDataSource<any>([]);
  accessRightsTable2 = new MatTableDataSource<any>([]);

  // inventory: any;
  data: any[] = [];
  selection = new SelectionModel<any>(true, []); // Store selected products

  @ViewChild(MatPaginator) paginator1!: MatPaginator;
  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  @ViewChild(MatPaginator) paginator3!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private fb: FormBuilder,private accessService:AccessrightsService,private alert:NotificationsService,
    private dialog : MatDialog,private menusService:MenusService,
    private productsService:ProductsService,
    private http:HttpClient

  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadOngoingProducts();

  }
  

  applyFilter(){
    this.products.filter = this.searchKey.trim().toLocaleLowerCase();
  }
  clearSearch(){
    this.searchKey = "";
    this.applyFilter();
  }

  
  async loadProducts(): Promise<void> {
    try {
      this.isLoading = true;
      this.data = await firstValueFrom(this.productsService.getEmployees());
    //  console.log(this.data)
    
      this.products.data = this.data;
      this.products.paginator = this.paginator1;
      this.products.sort = this.sort;
      this.isLoading = false;
  
    } catch (error) {
      console.error('Error fetching employee data:', error);
      this.isLoading = false;
    }
  }

toggleSelection(row: any): void {
  this.selection.toggle(row);
}

isSelected(product: any): boolean {
  return this.selection.isSelected(product);
}
toggleAll(event: any): void {
  if (event.checked) {
    this.selection.select(...this.products.data);
  } else {
    this.selection.clear();
  }
}

getCheckedData(): any[] {
  return this.selection.selected;
}

isAllSelected(): boolean {
  const numSelected = this.selection.selected.length;
  const numRows = this.products.data.length;
  return numSelected === numRows;
}

onAddToOngoing() {
  const checkedRecords = this.getCheckedData();

  if (checkedRecords.length === 0) {
    this.alert.toastrError("No checked row selected!");
  } else {
  
    checkedRecords.forEach((record) => {
      this.productsService.updateInventoryStatus(record.id, 'ongoing').subscribe(
        (dt) => {
          this.alert.popupSwalMixin("Records successfully selected!");
          this.loadOngoingProducts();  // Handle the response
        },
        (error) => {
          this.alert.toastrError("Failed to update record: " + record.id);  // Handle the error
        }
      );
    });
  }
}

loadOngoingProducts(): void {
  this.productsService.getOngoingProducts().subscribe(
    (data) => {

      this.ongoingProducts = data; // Assign the returned data to the ongoingProducts property
    },
    (error) => {
      this.errorMessage = error; // Assign the error message if there was an error
    }
  );
}

 
// async loadProducts(): Promise<void> {
//   try {
//     this.isLoading = true;
//     this.data = await firstValueFrom(this.productsService.getEmployees());
//   //  console.log(this.data)
  
//     this.products.data = this.data;
//     this.products.paginator = this.paginator1;
//     this.products.sort = this.sort;
//     this.isLoading = false;

//   } catch (error) {
//     console.error('Error fetching employee data:', error);
//     this.isLoading = false;
//   }
// }


displayOngoingStocks(data: any) {
  // Implement the logic to display ongoing stocks
  console.log(data.id);
}

  // async loadAccessRights(): Promise<void> {
  //   try {
  //     this.isLoading = true;
  //     this.accessUser = await firstValueFrom(this.accessService.getAccessRights());
  //     this.accessRightsTable.data = this.accessUser;
  //     this.accessRightsTable.paginator = this.paginator1;
  //     this.accessRightsTable.sort = this.sort;
  //     this.isLoading = false;
      
  //   } catch (error) {
  //     console.error('Error fetching employee data:', error);
  //     this.isLoading = false;
  //   }
  // }



  // saveAccessRight() {
  //   if (this.accessRightForm.valid) {
  //     const accessName = this.accessRightForm.getRawValue();
  //     this.accessService.saveUserAccess(accessName).subscribe({
  //       next: () => {
  //         this.isLoading = false;
  //         this.clearText();
  //         this.loadAccessRights();
  //       },
  //       error: (error) => {
  //         console.error('Error saving text:', error);
  //         this.isLoading = false;
  //         this.loadAccessRights();
  //       },
  //     });
  //   }
  // }

  editEmployee(data?: any): void {

    // const dialogRef = this.dialog.open(UsersUIRoleComponent, {
    //   width: '400px',
    //   data: data || null
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.loadAccessRights();
    //   }
    // });
  }

  deleteAccessRights(element:any){
    if(!element){
      this.alert.toastrWarning('No record selected!');
      
    }
    else{
      this.alert.popupWarning(element.accessRightName,"-"+"Are you sure to delete this access?").then((result) => {
        if (result.value) {
          this.accessService.deleteEmployee(element.id).subscribe({
              next:()=>{
                this.alert.popupSwalMixin("Successfuly deleted "+ element.accessRightName);
               // this.loadAccessRights();
              },
              error:()=>{
                this.alert.toastrError("no user id");
               // this.loadAccessRights();
              },
          });
        }
     });
   }
  }


  clickMenu(): void {
    
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = '400px';
    // const dialogRef = this.dialog.open(AddMenuUIComponent, dialogConfig,
    // );
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //    // this.loadModule(); // Refresh the table after dialog closure
    //   }
    // });

    
  }

  // async loadModule(): Promise<void> {
  //   try {
  //     this.isLoading = true;
  //     this.accessUser = await firstValueFrom(this.menusService.getModules());
  //     this.accessRightsTable.data = this.accessUser;
  //     this.accessRightsTable.paginator = this.paginator2;
  //     this.accessRightsTable.sort = this.sort;
  //     this.isLoading = false;
  
  //   } catch (error) {
  //     console.error('Error fetching module data:', error);
  //     this.isLoading = false;
  //   }
  // }

  // clearText() {
  //   this.accessRightForm.controls['accessRightName'].setValue('');
  // }
  // applyFilter(){
  //   this.accessRightsTable.filter = this.searchKey.trim().toLocaleLowerCase();
  // }
}

export interface Element {
  id: number;
  name: string;
}

// Mock data for tables
const ELEMENT_DATA_1: Element[] = [
  {id: 1, name: 'John'},
  {id: 2, name: 'Jane'},
  {id: 3, name: 'Smith'},
];

const ELEMENT_DATA_2: Element[] = [
  {id: 1, name: 'Admin'},
  {id: 2, name: 'User'},
];

