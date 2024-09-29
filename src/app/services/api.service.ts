import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})



export class ApiService {


  private authenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.authenticated.asObservable();


  private apiUrl = 'http://localhost:5274/api/Auth'; // URL of your .NET API

  constructor(private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) { }

  login(data: any, password: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }
  registter(register: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, register);
  }

  getToken(): string | null {
    return localStorage.getItem('token'); // Adjust based on how you store the token
  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      const token = this.getToken();
      if (token && this.jwtHelper.isTokenExpired(token)) {
        localStorage.removeItem('token'); // Clear the expired token
        this.router.navigate(['/login']); // Redirect to login page
      }
    }
    return throwError(() => error);
  }

  getProtectedData() {
    return this.http.get('/api/protected-data').pipe(
      catchError(this.handleError.bind(this))
    );
  }


}


