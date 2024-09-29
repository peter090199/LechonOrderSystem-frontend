import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { NotificationsService } from 'src/app/Global/notifications.service';

@Component({
  selector: 'app-change-password-ui',
  templateUrl: './change-password-ui.component.html',
  styleUrls: ['./change-password-ui.component.css']
})
export class ChangePasswordUIComponent implements OnInit {
  passwordForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private passwordService:UserProfileService,
    private alert2:NotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) { }

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      currentPassword: [{value:this.data.password, disabled:true}, [Validators.required]],
      userName: [this.data.userName, [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }
  onSubmit() {
    if (this.passwordForm.valid) {
      const user = this.passwordForm.getRawValue();
      if(user.newPassword != user.confirmPassword)
      {
        this.alert2.toastrError("Your password does not match!");
        return;
      }
      else{
          this.passwordService.updatePassword(user).subscribe({
            next: (response) => {
              this.alert2.popupSwalMixin("Password  Updated.");
              
            },
            error: (err) => {
              this.alert2.toastrError(err.error);
            },
          });
        }
    }
 
}

}
