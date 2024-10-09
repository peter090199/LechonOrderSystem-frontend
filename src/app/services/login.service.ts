import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { _url } from 'src/global-variables';
import { jwtDecode } from 'jwt-decode';
import { UsersRoleService } from './users-role.service';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private tokenKey = 'authToken';
  private _refreshrequired = new Subject<void>();

  get RequiredRefresh() {
    return this._refreshrequired;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private users:UsersRoleService
  ) {
    this.startTokenExpirationCheck(); // Start checking for token expiration on initialization
  }

  // Check if the user is authenticated and token is valid
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }
 user:any;
 userName: string="";
 
userroles()
{
  this.user = this.users.getUsers().subscribe({next:(res)=>{
    this.user = res;
    //console.log(this.user); 
   /// console.log(this.userName); 
  },
  error:(err)=>{
    console.error("Error user role:",err);
  }
});

}
  // Login method
  login(UserName: string, Password: string): Observable<any> {
    return this.http.post<any>(_url + 'Auth/login', { UserName, Password }).pipe(
      tap(res => {
        if (res && res.token) {
          this.saveToken(res.token);
          this.userName = UserName; // Assume the email is returned in the response
          localStorage.setItem('UserName', this.userName);
          localStorage.setItem('UserId', this.userName);
        //  const user = { UserName, role: 'user' }; 
        
       //   if(this.userName == "")

        //  localStorage.setItem('user', JSON.stringify(user));
          this._refreshrequired.next();
         // this.startTokenExpirationCheck(); // Restart token expiration check on login
        }
      }),
      catchError(this.handleLoginError())
    );
  }
  
  getUserNameProfile(): string | null {
    return this.userName || localStorage.getItem('UserName');
  }
  
  getUserRole(): string {
    const user = localStorage.getItem('user'); // Retrieve the user data from local storage
  
    if (user) {
      try {
        const parsedUser = JSON.parse(user); // Parse the user data
        return parsedUser; 
      } catch (error) {
        console.error('Error parsing user data:', error);
        return 'user'; 
      }
    }
    return 'user'; // Return default role if user data is not found
  }
  
  // Get token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Save token to local storage
  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
   
  }

  // Start token expiration check
  private startTokenExpirationCheck(): void {
    setInterval(() => {
      if (!this.isAuthenticated()) {
        this.handleUnauthorizedError();
      }
    }, 1000 * 60 * 1); // Check every 2 minutes
  }
  getUsername(): string | null {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
     // console.log('Decoded Token Payload:', decodedToken); // For debugging purposes
      // Adjust 'username' to match the actual field name in your token payload
      return decodedToken.username || decodedToken.sub || null; // Example fallback
    }
    return null;
  }
  
  // Handle login errors
  private handleLoginError<T>(operation = 'Auth/login', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status === 401) {
        this.handleUnauthorizedError();
      } else {
        this.handleGeneralError(error.message);
      }
      return of(result as T);
    };
  }

  // Handle unauthorized errors (e.g., token expired)
  handleUnauthorizedError(): void {
    this.logout(); // Remove token and redirect to login
    Swal.fire({
      icon: 'error',
      title: 'Session Expired',
      text: 'Your session has expired. Please log in again.',
    });
  }
  
  getDecodedToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
      //  console.log('Decoded Token:', decoded); // For debugging purposes
        return decoded;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }
  // Handle general errors
  private handleGeneralError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `An error occurred: ${message}`,
      footer: 'Please try again!'
    });
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  // Logout method
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user'); // Clear user data on logout
    this.router.navigate(['/login']); // Redirect to login page
    localStorage.removeItem('modules'); 
    localStorage.removeItem('subModules'); 
  
  }
}




