import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/Global/notifications.service';
import { MenusService } from 'src/app/services/menus.service';

@Component({
  selector: 'app-menus-ui',
  templateUrl: './menus-ui.component.html',
  styleUrls: ['./menus-ui.component.css']
})
export class MenusUIComponent implements OnInit {
  

  btnSave     : string = "Save";
  loading     : boolean = false;
  moduleForm = new FormGroup
     ({
        id      : new FormControl(0),
        moduleName    : new FormControl(''),
        application  : new FormControl(''),
     });
 

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog            : MatDialog,
    private dialogRef         : MatDialogRef<MenusUIComponent>,
    private notificationService :NotificationsService,
    private menusService      :MenusService
  ) {}

  ngOnInit(): void {
    if (this.data) {
      if(this.data.id){
        this.btnSave = "Update";
        this.GetModuleFormData();
      }
    }
  }
  GetModuleFormData(){
    this.moduleForm.controls['id'].setValue(this.data.id);
    this.moduleForm.controls['moduleName'].setValue(this.data.moduleName);
    this.moduleForm.controls['application'].setValue(this.data.application);
    this.moduleForm.controls['recordStatus'].setValue(this.data.recordStatus);
  }
  
  onSubmit() {
    this.loading = true;
     const moduledata = this.moduleForm.getRawValue();
     if (this.btnSave == "Save")
      {
          this.menusService.postModule(moduledata).subscribe({
            next: () => {
              this.notificationService.popupSwalMixin("Successfully Saved.");
              this.ResetForm();
              this.loading = false;
            },
            error: () => {
              this.notificationService.toastrError("Error Data");
              this.loading = false;
            },
          });
       } 
     else if (this.btnSave == 'Update') 
        {
        this.menusService.updateModule(moduledata,this.data.id).subscribe({
          next: () => {
            this.notificationService.popupSwalMixin("Successfully Updated.");
            this.dialogRef.close(true); 
            this.loading = false;
          },
          error: () => {
            this.notificationService.toastrError("Error Data");
            this.loading = false;
          },
        });
     }
    }
    ResetForm() {
      this.moduleForm.controls['id'].setValue('');
      this.moduleForm.controls['moduleName'].setValue('');
      this.moduleForm.controls['application'].setValue('');
    }
}
