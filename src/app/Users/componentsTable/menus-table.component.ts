import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/Global/notifications.service';
import { MenusUIComponent } from '../componentsUI/menus-ui.component';
import { SubModulesUIComponent } from '../componentsUI/sub-modules-ui.component';
import { MenusService } from 'src/app/services/menus.service';
import { firstValueFrom } from 'rxjs';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-menus-table',
  templateUrl: './menus-table.component.html',
  styleUrls: ['./menus-table.component.css']
})
export class MenusTableComponent implements OnInit {


  placeHolder       : string = "Search";
  searchKey         : string = "";
  listData = new MatTableDataSource<any>([]);

  displayedColumns: string[] = ['moduleName', 'application','recordStatus'];
  addedColumns: string[] = [    
    'Actions',
  ];
 mergeColumns: any = this.displayedColumns.concat(this.addedColumns);

  isLoading : boolean = true;
  modules: any=[];
  pageSizeOptions   : number[] = [5, 10, 25, 100];
  selectedRow: any = null;

  constructor(private dialog : MatDialog,
    private notificationsService : NotificationsService,  private menusService : MenusService
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadModule();
    this.menusService.RequiredRefresh.subscribe(() =>{
      this.loadModule();
    })
  }
 
    async loadModule(): Promise<void> {
    try {
      this.isLoading = true;
      this.modules = await firstValueFrom(this.menusService.getModules());
      this.listData.data = this.modules;
      this.listData.paginator = this.paginator;
      this.listData.sort = this.sort;
      this.isLoading = false;
  
    } catch (error) {
      console.error('Error fetching module data:', error);
      this.isLoading = false;
    }
  }

  applyFilter(){
    this.listData.filter = this.searchKey.trim().toLocaleLowerCase();
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
    const dialogRef = this.dialog.open(MenusUIComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.loadModule(); // Refresh the table after dialog closure
      }
    });
  }
     onClickSubmodules() {
        // Ensure a row is selected before proceeding
        if (!this.selectedRow) {
          this.NorowSelected();  // Call a method to notify that no row is selected
          return;
        }
      
        // Configure dialog settings
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;  // Prevent closing the dialog by clicking outside
        dialogConfig.autoFocus = true;     // Auto-focus on the first input element
        dialogConfig.width = '400px';      // Set dialog width
     
        // Open the SubModules dialog and pass the selected row data
        const dialogRef = this.dialog.open(SubModulesUIComponent, {
          width: '400px',
          data: this.selectedRow  // Pass the selected row as data to the dialog
        
        });
       // console.log(this.selectedRow)
        // After dialog is closed, refresh the table if result is truthy
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.selectedRow = null;
            this.loadModule(); 
          }
        });
  }
  

    deleteModule(element:any){
      if(!element){
        this.notificationsService.toastrWarning('No record selected!');
        
      }
      else{
        this.notificationsService.popupWarning(element.moduleName,"-"+"Are you sure to delete this module?").then((result) => {
          if (result.value) {
            this.menusService.deleteModule(element.id).subscribe({
                next:()=>{
                  this.notificationsService.popupSwalMixin("Successfuly deleted "+ element.moduleName);
                  this.loadModule();
                },
                error:()=>{
                  this.notificationsService.toastrError("no module id");
                  this.loadModule();
                },
            });
          }
       });
     }
    }
  
      editModule(element: any): void {
        const dialogRef = this.dialog.open(MenusUIComponent, {
          width: '400px',
          data: element
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadModule();
          }
        });
      }
   
      onRowClick(row: any) {
        this.selectedRow = row;  // Mark the clicked row as selected
         //console.log('Row clicked:', row);  
        // Perform any additional actions on row click
      }

       // Method to open the dialog with the selected row data
      NorowSelected() {
        if (!this.selectedRow) {
          this.notificationsService.toastrError("No row Selected!");
          return;
        }


  }


}



