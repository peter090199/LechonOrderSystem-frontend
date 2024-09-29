import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/services/login.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChangePasswordUIComponent } from '../change-password-ui/change-password-ui.component';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { NotificationsService } from 'src/app/Global/notifications.service';

@Component({
  selector: 'app-user-profile-ui',
  templateUrl: './user-profile-ui.component.html',
  styleUrls: ['./user-profile-ui.component.css']
})

export class UserProfileUIComponent implements OnInit {
  profileForm!: FormGroup;
  profileImageUrl: string = 'assets/default-profile.png'; // Placeholder image
  
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  getuserName: any;
  userName: string = "";
  users: any;

  constructor(
    private fb: FormBuilder, private http: HttpClient,
    private authService:LoginService,
    private dialog : MatDialog,
    private userProfileService:UserProfileService,
    private alert:NotificationsService

  ){  
    this.initializeForm();
   }

   initializeForm() {
    this.userName = this.authService.getUserNameProfile() || ''; // Ensure userName is not null/undefined
    this.profileForm = this.fb.group({
      username: [{ value: this.userName, disabled: true }, Validators.required],
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      contactNo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
   this.loadUserProfile();
   
  }
 

  loadUserProfile(): void {
    this.userProfileService.getUserByUsername(this.userName).subscribe({
      next: (data) => {
        this.users = data;
        this.profileForm.patchValue(this.users);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching user data', err);
        this.isLoading = false;
      }
    });
  }


  loading     : boolean = false;
  isLoading = true;

  onSubmit(): void {
    if (this.profileForm.valid) {
      const profileData = this.profileForm.getRawValue(); // Get the form data
      this.userProfileService.updateUserProfile(profileData).subscribe({
        next: (res) => {
         // console.log("successfuly updated.")
          this.alert.popupSwalMixin('User successfully updated.');
        },
        error: (err) => {
          this.alert.toastrError(err.error);
        },
      });
    }
  }

  onChangePassword():void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = this.users;
    const dialogRef = this.dialog.open(ChangePasswordUIComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
         this.loadUserProfile();
      }
    });
  }


  onUploadPhoto(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}

