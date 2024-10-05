// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-products-ui',
//   templateUrl: './products-ui.component.html',
//   styleUrls: ['./products-ui.component.css']
// })
// export class ProductsUIComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeesService } from 'src/app/services/employees.service';
import { NotificationsService } from 'src/app/Global/notifications.service';


@Component({
  selector: 'app-products-ui',
  templateUrl: './products-ui.component.html',
  styleUrls: ['./products-ui.component.css']
})
export class ProductsUIComponent implements OnInit {

  btnSave     : string = "Save";
  loading     : boolean = false;

  EmployeeForm = new FormGroup({
              id      : new FormControl(0),
              empID    : new FormControl(''),
              empName  : new FormControl(''),
              address      : new FormControl(''),
              contactNo     : new FormControl(''),
  });
  
  constructor(
    private dialog            : MatDialog,
    private dialogRef         : MatDialogRef<ProductsUIComponent>,
    private empService: EmployeesService,
    private notificationService   : NotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) { }

  ngOnInit(): void {
    if (this.data) {
      if(this.data.id){
        this.btnSave = "Update";
        this.EmployeeForm.controls['empID'].disable();
        this.GetItemFormData();
      }
  
    }else{
      this.onCheck(true);
    }
   
  }

  
  GetItemFormData(){
    this.EmployeeForm.controls['id'].setValue(this.data.id);
    this.EmployeeForm.controls['empID'].setValue(this.data.empID);
    this.EmployeeForm.controls['empName'].setValue(this.data.empName);
    this.EmployeeForm.controls['address'].setValue(this.data.address);
    this.EmployeeForm.controls['contactNo'].setValue(this.data.contactNo);
  }

  onSubmit() {
    this.loading = true;
   const employeeData = this.EmployeeForm.getRawValue();
  
    if (this.btnSave == "Save")
       {
        this.empService.postEmployee(employeeData).subscribe({
          next: (res) => {
            this.notificationService.popupSwalMixin("Successfully Saved.");
            this.ResetForm();
            this.loading = false;
          },
          error: (err) => {
            this.notificationService.toastrError(err.error);
            this.loading = false;
          },
        });
    } 
    else if (this.btnSave == 'Update') 
      {
      this.empService.updateEmployee(employeeData,this.data.id).subscribe({
        next: () => {
          this.notificationService.popupSwalMixin("Successfully Updated.");
          this.dialogRef.close(true); 
          this.loading = false;
        },
        error: (err) => {
          this.notificationService.toastrError(err.error);
          this.loading = false;
        },
      });
    }
  }
  

  onCheck(data: any) {
    if (data) {
      this.EmployeeForm.controls['empID'].disable();
      this.EmployeeForm.controls['empID'].setValue('generated');
    }
    else {
      this.EmployeeForm.controls['empID'].enable();
      this.EmployeeForm.controls['empID'].setValue('');
    }
  }

  ResetForm(){
    this.EmployeeForm.controls['empID'].setValue('');
    this.EmployeeForm.controls['empName'].setValue('');
    this.EmployeeForm.controls['address'].setValue('');
    this.EmployeeForm.controls['contactNo'].setValue('');
  }

}

