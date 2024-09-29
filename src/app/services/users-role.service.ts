import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { _url } from 'src/global-variables';
import { Users } from '../Model/Users';


@Injectable({
  providedIn: 'root'
})
export class UsersRoleService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  private _refreshrequired = new Subject<void>();

  get RequiredRefresh() {
    return this._refreshrequired;
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(_url+"Auth/GetUsers");
  }
// save 
postEmployee(userForm: any): Observable<any>{
  return this.http.post<any>(_url+'Auth/register',userForm).pipe(
    tap(()=>{
      this.RequiredRefresh.next();
    }),
    catchError(this.handleError<any>('Auth/register'))
  );
}

    
  // // PUT: Update an existing employee
  updateEmployee(userData: any, id: number): Observable<void> {
    const url = `${_url}Auth/UpdateUser/${id}`; // Correct URL construction
    return this.http.put<void>(url, userData) // Pass EmployeeForm as the body
      .pipe(
        catchError(this.handleError<void>('updateEmployee'))
      );
  }

  
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${_url}Auth/DeleteUser/${id}`);
  }

    
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); 
      return of(result as T);
    };
  }

}
