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
import Swal from 'sweetalert2';

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
  
  displayedColumns2: string[] = ['productName','quantity'];
  addedColumns2: string[] = [    
    'physicalcount',
  ];
  mergeColumns: string[] = ['select', 'productName', 'category','quantity'];

//  mergeColumns: any = this.displayedColumns.concat(this.addedColumns);
 mergeColumns2: any = this.displayedColumns2.concat(this.addedColumns2);
  isLoading :boolean = true;
  isLoading2 :boolean = true;
  ongoingProducts: any=[];
  errorMessage: string | null = null;
  cntOngoing: any;
  products = new MatTableDataSource<any>([]);
  accessRightsTable2 = new MatTableDataSource<any>([]);
  pendingdata: any=[];
  selection = new SelectionModel<any>(true, []); // Store selected products

  @ViewChild(MatPaginator) paginator1!: MatPaginator;
  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  @ViewChild(MatPaginator) paginator3!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  constructor(private fb: FormBuilder,private accessService:AccessrightsService,private alert:NotificationsService,
    private dialog : MatDialog,private menusService:MenusService,
    private productsService:ProductsService,
    private http:HttpClient

  ) {}

  ngOnInit(): void {
    this.loadPendingProducts();
    this.loadOngoingProducts();

  }


  applyFilter(){
    this.products.filter = this.searchKey.trim().toLocaleLowerCase();
  }
  clearSearch(){
    this.searchKey = "";
    this.applyFilter();
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
          this.alert.popupSwalMixin("Succesfully Added.");
          this.loadPendingProducts();
          this.loadOngoingProducts();  // Handle the response
        },
        (error) => {
          this.alert.toastrError("Failed to update record: " + record.id);  // Handle the error
        }
      );
    });
  }
}


async loadOngoingProducts(): Promise<void> {
  try {
    this.ongoingProducts = await firstValueFrom(this.productsService.getOngoingProducts());
    this.accessRightsTable2.data = this.ongoingProducts;
    // console.log(this.ongoingProducts)
    this.accessRightsTable2.paginator = this.paginator2;
    this.accessRightsTable2.sort = this.sort;
    this.isLoading2 = false;
  } 
  catch (error) {
    console.error('Error fetching items data:', error);
    this.isLoading2 = true; 
  } 
}

async loadPendingProducts(): Promise<void> {
  try {
    this.pendingdata = await firstValueFrom(this.productsService.getInventoryPendingProducts());
    this.products.data = this.pendingdata;
    this.products.paginator = this.paginator1;
    this.products.sort = this.sort;
    this.isLoading = false;
  } 
  catch (error) {
    console.error('Error fetching items data:', error);
    this.isLoading = true; 
  } 
}

displayOngoingStocks(data: any) {
  // Implement the logic to display ongoing stocks
  console.log(data.id);
}


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

  onPhysicalCountChange(product: any) {
    // Handle the change of physical count
    console.log('Updated physical count for product:', product.physicalCount);
    
    // If necessary, send an API call or store the updated value
  }

  // openConfirmationDialog(message: string): Promise<boolean> {
  //   const dialogRef = this.dialog.open(YourConfirmationDialogComponent, {
  //     data: { message: message }
  //   });

  //   return dialogRef.afterClosed().toPromise();
  // }

  async showWarningDialog(message: string): Promise<boolean> {
    return Swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, continue',
      cancelButtonText: 'No, cancel'
    }).then((result:any) => {
      return result.isConfirmed;  // Returns true if confirmed, false otherwise
    });
  }

  // Add to finish logic
  async addToFinish(): Promise<void> {
    const msg = "Blank PhysicalCount Will NOT be included?";
    this.alert.popupWarning(msg,".");
    const result = await this.showWarningDialog(msg);

    if (!result) {
      return;
    }
    this.ongoingProducts.forEach(async (pd:any) => {
      let physicalCount = 0;
   
      // Check if physicalCount is provided and numeric
      if (pd.physicalCount !== null && !isNaN(pd.physicalCount)) {
        physicalCount = parseFloat(pd.physicalCount);
      //  console.log(pd.physicalCount)
      } 
      else {
        const availableQty = parseFloat(pd.available);
        if (availableQty > 0) {
          physicalCount = availableQty;
        }
        if (physicalCount > 0) {
          const item = await this.productsService.getproductsById(pd.id);
          this.setNewInventoryCounts(item, physicalCount);
         // await this.productsService.updateInventoryStatus('finish', pd.id);
        }
      }
    });
    Swal.fire('Success', 'Successfully Saved', 'success');

    this.displayOngoingStocks2();
    this.displayFinishStocks();
  }

  setNewInventoryCounts(item: any, physicalCount: number) {
    // Implement logic to update inventory counts here
  }

  displayOngoingStocks2() {
    // Refresh the ongoing products list
    this,this.productsService.getOngoingProducts().subscribe(data => {
      this.ongoingProducts = data;
    });
  }

  displayFinishStocks() {
    // Refresh the finished products list
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

