import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { NotificationsService } from '../Global/notifications.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  ngOnInit(): void {
    // const user = this.users.getUsers();
    // console.log(this.users);
  }

  
  // private initializeForm(): void {
  //   this.loginForm = this.fb.group({
  //     UserName: ['', [Validators.required]],
  //     Password: ['', [Validators.required, Validators.minLength(6)]]
  //   });
  // }
  
  hide = true;
  loginForm: FormGroup;
  hidePassword: any;

  constructor(private fb: FormBuilder, private router: Router,private loginService: LoginService,
    private notificationService:NotificationsService,private sharedService: SharedService
  ) { 
    this.loginForm = this.fb.group({
      UserName: ['', [Validators.required]],
      Password: ['', [Validators.required, Validators.minLength(6)]]
    });

  } 
  user:any;
  onSubmit() 
  {
   
    const { UserName, Password } = this.loginForm.value;
    this.loginService.login(UserName, Password).subscribe({
      next:(response) => {
      const userRole = response.role; 
      localStorage.setItem('user', JSON.stringify(userRole));
      this.sharedService.setUsername(UserName);
      this.sharedService.setUserRole(userRole); // Save role
      this.notificationService.popupSwalMixin("Successfully Logged In.");
      if (userRole === 'admin') {
        this.router.navigate(['/header/home']);
      } 
      else {
        this.router.navigate(['/header']); // Default dashboard
      }
      },
      error: (err) => {
        if (err.status === 401) {
          // If unauthorized, redirect to login
          this.router.navigate(['/login']);
        } else {
          this.notificationService.toastrError(err.error.message);
        }

      }
    });
  }

}

