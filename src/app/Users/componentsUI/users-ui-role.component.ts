import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersRoleService } from 'src/app/services/users-role.service';// Make sure to implement this service
import { Users } from 'src/app/Model/Users';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/Global/notifications.service';
import { AccessrightsService } from 'src/app/services/accessrights.service';
@Component({
  selector: 'app-users-ui-role',
  templateUrl: './users-ui-role.component.html',
  styleUrls: ['./users-ui-role.component.css']
})
export class UsersUIRoleComponent implements OnInit {
  displayedColumns: string[] = ['id', 'userName', 'role', 'actions'];
  dataSource = new MatTableDataSource<Users>([]);

  searchKey: string = '';
  loading     : boolean = false;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  btnSave     : string = "Save";

  userForm = new FormGroup({
    id      : new FormControl(0),
    userName    : new FormControl(''),
    password  : new FormControl(''),
    role: new FormControl(''),

});

 roles: string[] = []; // get roles

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  

  constructor(private userService: UsersRoleService, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog            : MatDialog,
    private dialogRef         : MatDialogRef<UsersUIRoleComponent>,
    private notificationService :NotificationsService,
    private accessService : AccessrightsService
  ) { 
      this.loadAccess();
    }


  loadAccess() {
    this.accessService.getAccessRights().subscribe(
      (data: any[]) => {
        this.roles = data.map((role) => role.accessRightName); // Map accessRightName to the roles array
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }
  
  
  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.btnSave = "Update";
      this.GetItemFormData();
    }
   
  }
  
  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe(users => {
      this.dataSource.data = users;
      this.loading = false;
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  clearSearch(): void {
    this.searchKey = '';
    this.applyFilter();
  }
 
  onSubmit() {
  this.loading = true;
   const userData = this.userForm.getRawValue();
  
    if (this.btnSave == "Save")
       {
        this.userService.postEmployee(userData).subscribe({
          next: () => {
            this.notificationService.popupSwalMixin("Successfully Saved.");
            this.loading = false;
            this.ResetForm();
          },
          error: () => {
            this.notificationService.toastrError("Error Data");
            this.loading = false;
          },
        });
    } 
    else if (this.btnSave == 'Update') 
      {
      this.userService.updateEmployee(userData,this.data.id).subscribe({
        next: (res) => {
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
    this.userForm.controls['id'].setValue('');
    this.userForm.controls['userName'].setValue('');
    this.userForm.controls['password'].setValue('');
    this.userForm.controls['role'].setValue('');
  }
  
  onClose(): void {
    this.dialog.closeAll();
  }
    
  GetItemFormData(){
    this.userForm.controls['id'].setValue(this.data.id);
    this.userForm.controls['userName'].setValue(this.data.userName);
    this.userForm.controls['password'].setValue(this.data.password);
    this.userForm.controls['role'].setValue(this.data.role);
  }

}

