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
import { ProductsService } from 'src/app/services/products.service';
import { NotificationsService } from 'src/app/Global/notifications.service';


@Component({
  selector: 'app-products-ui',
  templateUrl: './products-ui.component.html',
  styleUrls: ['./products-ui.component.css']
})
export class ProductsUIComponent implements OnInit {

  btnSave     : string = "Save";
  loading     : boolean = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

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
    private empService: ProductsService,
    private notificationService   : NotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) { }

  ngOnInit(): void {
    if (this.data)
   {
     if(this.data.id){
        this.btnSave = "Update";
        this.EmployeeForm.controls['empID'].disable();
        this.GetItemFormData();
      }
  
    }
    else{
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


  onSubmit():void {
    this.loading = true;
   //  const employeeData = this.EmployeeForm.getRawValue();
   if (this.EmployeeForm.valid && this.selectedFile) {
      const employeeData = new FormData(); // Use FormData for file and form data
      employeeData.append('id', this.EmployeeForm.get('id')?.value);
      employeeData.append('empID', this.EmployeeForm.get('empID')?.value);
      employeeData.append('empName', this.EmployeeForm.get('empName')?.value);
      employeeData.append('address', this.EmployeeForm.get('address')?.value);
      employeeData.append('contactNo', this.EmployeeForm.get('contactNo')?.value);
      employeeData.append('image', this.selectedFile);
  
      // Append file if selected
      if (this.selectedFile) {
        employeeData.append('Image', this.selectedFile);
      }
    
      if (this.btnSave == "Save")
        {
          console.log(employeeData)
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
       if (this.btnSave == 'Update') 
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
  }

  // Handle file input change
  onFileChange22(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Preview the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle file selection
  onUploadPhoto(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      // Preview the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  


  onCheck(data: any) {
    if (data) {
      this.EmployeeForm.controls['empID'].disable();
      this.EmployeeForm.controls['empID'].setValue('Generated');
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
    // this.EmployeeForm.reset();
    this.previewUrl = null; // Reset image preview
    this.selectedFile = null; // Reset selected file
  }

}

