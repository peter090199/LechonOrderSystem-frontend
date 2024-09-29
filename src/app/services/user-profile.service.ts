import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  // Get user by username
  getUserByUsername(username: string): Observable<any> {
    const url = `${_url}UserProfile/GetUserByUsername/${username}`; // Ensure correct URL structure
    return this.http.get<any>(url).pipe(
      catchError(this.handleError<any>('getUserByUsername')) // Adjusted the error type
    );
  }
  
  constructor(private http: HttpClient) { }

   // // PUT: Update an existing employee
   updateUserProfile(profileData: any): Observable<void> {
    const url = `${_url}UserProfile/UpdateUser`; // Construct the correct URL with the base URL and endpoint
    return this.http.put<void>(url, profileData) // Pass profileData as the body
      .pipe(
        catchError(this.handleError<void>('updateUserProfile')) // Handle errors with a descriptive message
      );
  }
  updatePassword(user: any): Observable<void> {
    const url = `${_url}UserProfile/update-password`; // Construct the correct URL with the base URL and endpoint
    return this.http.put<void>(url, user) // Pass profileData as the body
      .pipe(
        catchError(this.handleError<void>('updatePassword')) // Handle errors with a descriptive message
      );
  }

  // updatePassword(userName: string, newPassword: string): Observable<any> {
  //   const body = {
  //     userName,
  //     newPassword,
  //   };
  //   return this.http.put(`${_url}update-password`, body);
  // }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); 
      return of(result as T);
    };
  }
  

}
