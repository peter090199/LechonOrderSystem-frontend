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

  productForm = new FormGroup({
              id      : new FormControl(0),
              productId    : new FormControl(''),
              productName  : new FormControl(''),
              category      : new FormControl(''),
              price     : new FormControl(''),
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
        this.productForm.controls['productId'].disable();
        this.GetItemFormData();
      }
  
    }
    else{
      this.onCheck(true);
    }
   
  }

  
  GetItemFormData(){
    this.productForm.controls['id'].setValue(this.data.id);
    this.productForm.controls['productId'].setValue(this.data.productId);
    this.productForm.controls['productName'].setValue(this.data.productName);
    this.productForm.controls['category'].setValue(this.data.category);
    this.productForm.controls['price'].setValue(this.data.price);
  }

  onSubmit():void {
    this.loading = true;
   //  const employeeData = this.EmployeeForm.getRawValue();
   if (this.productForm.valid) {
      const employeeData = new FormData(); // Use FormData for file and form data
      employeeData.append('id', this.productForm.get('id')?.value);
      employeeData.append('productId', this.productForm.get('productId')?.value);
      employeeData.append('productName', this.productForm.get('productName')?.value);
      employeeData.append('category', this.productForm.get('category')?.value);
      employeeData.append('price', this.productForm.get('price')?.value);
     // employeeData.append('image', this.selectedFile);
  
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
      this.productForm.controls['productId'].disable();
      this.productForm.controls['productId'].setValue('Generated');
    }
    else {
      this.productForm.controls['productId'].enable();
      this.productForm.controls['productId'].setValue('');
    }
  }

  ResetForm(){
    this.productForm.controls['productId'].setValue('');
    this.productForm.controls['productName'].setValue('');
    this.productForm.controls['category'].setValue('');
    this.productForm.controls['price'].setValue('');
    this.previewUrl = null; // Reset image preview
    this.selectedFile = null; // Reset selected file
  }

}

