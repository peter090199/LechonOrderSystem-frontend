import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/Global/notifications.service';
import { SubModulesService } from 'src/app/services/sub-modules.service';
import { firstValueFrom } from 'rxjs';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-sub-modules-ui',
  templateUrl: './sub-modules-ui.component.html',
  styleUrls: ['./sub-modules-ui.component.css']
})
export class SubModulesUIComponent implements OnInit {

 submoduleForm!: FormGroup;
  btnSave     : string = "Save";
  // submoduleForm = new FormGroup
  // ({
  //     id      : new FormControl(0),
  //     SubmoduleName   : new FormControl(''),
  //     ModuleId : this.data.id
  // });

searchKey         : string = "";
pageSizeOptions1: number[] = [5, 10, 25, 100];
displayedColumns: string[] = ['subModuleName','recordStatus'];
addedColumns: string[] = [    
  'actions',
];

mergeColumns: any = this.displayedColumns.concat(this.addedColumns);
isLoading : boolean = true;
subModules: any = [];
listData = new MatTableDataSource<any>([]);

//accessRightsTable = new MatTableDataSource<Element>(ELEMENT_DATA_1);

constructor(private fb: FormBuilder,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private dialog            : MatDialog,
  private dialogRef         : MatDialogRef<SubModulesUIComponent>,
  private notificationService :NotificationsService,
  private subModuleService : SubModulesService,
){
     this.submoduleForm = this.fb.group({
      id: [0],
      SubmoduleName: [this.data?.SubmoduleName],
      ModuleId: [this.data.id]
    });
  }
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
ngOnInit(): void {
  this.loadSubModule();
  this.subModuleService.RequiredRefresh.subscribe(() =>{
    this.loadSubModule();
   // this.GetModuleFormData();
 })
}
GetModuleFormData(){
  this.submoduleForm.controls['id'].setValue(this.data.id);
  this.submoduleForm.controls['subModuleName'].setValue(this.data.SubmoduleName);
  this.submoduleForm.controls['ModuleId'].setValue(this.data.ModuleId);
}
async loadSubModule(): Promise<void> {
  try {
    const moduleId = this.data.id; // Ensure data exists
    this.isLoading = true;
    this.subModules = await firstValueFrom(this.subModuleService.GetSubModuleByID(moduleId));
    this.listData.data = this.subModules;
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
    this.isLoading = false;

  } catch (error) {
    console.error('Error fetching module data:', error);
    this.isLoading = false;
  }
}


    saveAccessRight() {
      if (this.submoduleForm.valid) {
        const subModule = this.submoduleForm.getRawValue();
        console.log(subModule)
        this.subModuleService.SavedSubModule(subModule).subscribe({
          next: () => {
            console.log('Access right saved:', subModule);
            this.isLoading = false;
             this.clearText();
           // this.loadAccessRights();
          },
          error: (error) => {
            console.error('Error saving text:', error);
            this.isLoading = false;
          //  this.loadAccessRights();
          },
        });
      }
    }
    clearText() {
      this.submoduleForm.controls['SubmoduleName'].setValue('');
    }
    Search(){
      this.searchKey = "";
      this.applyFilter();
    }
    applyFilter(){
      this.listData.filter = this.searchKey.trim().toLocaleLowerCase();
    }
    onSubmit() {
      
    }
    deleteModule(_t72: any) {
      throw new Error('Method not implemented.');
      }
      editModule(_t72: any) {
      throw new Error('Method not implemented.');
      }
      deleteAccessRights(arg0: any) {
      throw new Error('Method not implemented.');
      }
    

}

export interface Element {
  id: number;
  submoduleName: string;
  recordstatus:string;
}

// Mock data for tables
const ELEMENT_DATA_1: Element[] = [
  {id: 1, submoduleName: 'John',recordstatus:'Active' },
  {id: 2, submoduleName: 'Jane',recordstatus:'Active' },
  {id: 3, submoduleName: 'Smith',recordstatus:'Active' },
  
];

