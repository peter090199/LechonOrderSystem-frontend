import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/products.service';
import { Employees } from 'src/app/Model/Employees';
import { NotificationsService } from 'src/app/Global/notifications.service';

@Component({
  selector: 'app-edit-employee-component',
  templateUrl: './edit-employee-component.html',
  styleUrls: ['./edit-employee-component.css']
})
export class EditEmployeeComponent implements OnInit {
  editEmployeeForm = new FormGroup({
    empName: new FormControl(''),
    empID: new FormControl(''),
    address: new FormControl(''),
    contactNo :  new FormControl('') // You can set an initial value here if needed
  });

  constructor(
    private dialogRef: MatDialogRef<EditEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Injected data
    private employeeService: ProductsService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.editEmployeeForm.controls['empID'].setValue(this.data.empID);
    this.editEmployeeForm.controls['empName'].setValue(this.data.empName);
    this.editEmployeeForm.controls['address'].setValue(this.data.address);
    this.editEmployeeForm.controls['contactNo'].setValue(this.data.contactNo);
  }

  onSubmit(): void {
    if (this.editEmployeeForm.valid) {
      const updatedEmployee = this.editEmployeeForm.value;
    //  console.log(this.editEmployeeForm)
      this.employeeService.updateProduct(updatedEmployee,this.data.Id).subscribe({
        next: (res) => {
          this.notificationsService.popupSwalMixin("Successfully Saved. " + res);
          this.Reset();
          this.dialogRef.close(updatedEmployee); // Close the dialog and pass the updated data
        },
        error: (err) => {
          this.notificationsService.toastrError(err.message);
        },
      });
    }
  }
  Reset(): void {
    this.editEmployeeForm.reset();
  }
}
