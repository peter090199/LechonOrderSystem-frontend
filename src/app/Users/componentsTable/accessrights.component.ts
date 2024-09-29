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
import { AddMenuUIComponent } from '../componentsUI/add-menu-ui/add-menu-ui.component';
import { MenusService } from 'src/app/services/menus.service';

@Component({
  selector: 'app-accessrights',
  templateUrl: './accessrights.component.html',
  styleUrls: ['./accessrights.component.css']
})

export class AccessrightsComponent implements OnInit {


  @ViewChild(MatPaginator) paginator1!: MatPaginator;
  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  @ViewChild(MatPaginator) paginator3!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  dataSource1 = new MatTableDataSource<Element>(ELEMENT_DATA_1);
  dataSource2 = new MatTableDataSource<Element>(ELEMENT_DATA_2);
  pageSizeOptions1: number[] = [5, 10, 25, 100];
  pageSizeOptions2: number[] = [5, 10, 25, 100];
  pageSizeOptions3: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = ['name'];
  
  addedColumns: string[] = [    
    'Actions',
  ];

  displayedColumns2: string[] = ['moduleName', 'application','recordStatus'];
  addedColumns2: string[] = [    
    'Actions',
  ];

 mergeColumns: any = this.displayedColumns.concat(this.addedColumns);
 mergeColumns2: any = this.displayedColumns2.concat(this.addedColumns2);

  isLoading :boolean = true;
  searchKey         : string = "";
  
  accessUser: any=[];
  accessRightsTable = new MatTableDataSource<any>([]);
  accessRightsTable2 = new MatTableDataSource<any>([]);

  accessRightForm = new FormGroup({
    id                : new FormControl(0),
    accessRightName   : new FormControl(''),
    recordStatus      : new FormControl('Active')
});

  constructor(private fb: FormBuilder,private accessService:AccessrightsService,private alert:NotificationsService,
    private dialog : MatDialog,private menusService:MenusService
  ) { }

  ngOnInit(): void {
    this.loadAccessRights();

  }

  
  async loadAccessRights(): Promise<void> {
    try {
      this.isLoading = true;
      this.accessUser = await firstValueFrom(this.accessService.getAccessRights());
      this.accessRightsTable.data = this.accessUser;
      this.accessRightsTable.paginator = this.paginator1;
      this.accessRightsTable.sort = this.sort;
      this.isLoading = false;
      
    } catch (error) {
      console.error('Error fetching employee data:', error);
      this.isLoading = false;
    }
  }

  ngAfterViewInit() {
    this.dataSource1.paginator = this.paginator1;
    this.dataSource2.paginator = this.paginator2;
  }

  saveAccessRight() {
    if (this.accessRightForm.valid) {
      const accessName = this.accessRightForm.getRawValue();
      this.accessService.saveUserAccess(accessName).subscribe({
        next: () => {
          this.isLoading = false;
          this.clearText();
          this.loadAccessRights();
        },
        error: (error) => {
          console.error('Error saving text:', error);
          this.isLoading = false;
          this.loadAccessRights();
        },
      });
    }
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
                this.loadAccessRights();
              },
              error:()=>{
                this.alert.toastrError("no user id");
                this.loadAccessRights();
              },
          });
        }
     });
   }
  }

  data:any=[];
  clickMenu(): void {
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    const dialogRef = this.dialog.open(AddMenuUIComponent, dialogConfig,
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       // this.loadModule(); // Refresh the table after dialog closure
      }
    });

    
  }
  async loadModule(): Promise<void> {
    try {
      this.isLoading = true;
      this.accessUser = await firstValueFrom(this.menusService.getModules());
      this.accessRightsTable.data = this.accessUser;
      this.accessRightsTable.paginator = this.paginator2;
      this.accessRightsTable.sort = this.sort;
      this.isLoading = false;
  
    } catch (error) {
      console.error('Error fetching module data:', error);
      this.isLoading = false;
    }
  }

  clearText() {
    this.accessRightForm.controls['accessRightName'].setValue('');
  }
  applyFilter(){
    this.accessRightsTable.filter = this.searchKey.trim().toLocaleLowerCase();
  }
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
