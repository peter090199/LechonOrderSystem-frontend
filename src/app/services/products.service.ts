import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { _url } from 'src/global-variables';
import { Employees } from '../Model/Employees';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  // Define HTTP options for headers, if needed
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  _url: any;


  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  private _refreshrequired = new Subject<void>();

  get RequiredRefresh() {
    return this._refreshrequired;
  }

  getEmployees(): Observable<any> {
    return this.http.get<any>(_url+"Products");
  }
    // save 
    postEmployee(employeeData: FormData): Observable<any>{
      return this.http.post<any>(_url+'Products/SavedProducts',employeeData).pipe(
        tap(()=>{
          this.RequiredRefresh.next();
        }),
        catchError(this.handleError<any>('Auth/register'))
      );
    }

    // updateEmployee(id: number): Observable<void> {
    //   return this.http.put<void>(_url+'Employees/'+id);
    // }
    
    
  // // PUT: Update an existing employee
  updateEmployee(EmployeeForm: any, id: number): Observable<void> {
    const url = `${_url}Products/${id}`; // Correct URL construction
    return this.http.put<void>(url, EmployeeForm, this.httpOptions) // Pass EmployeeForm as the body
      .pipe(
        catchError(this.handleError<void>('updateEmployee'))
      );
  }
  
    deleteEmployee(empID: string): Observable<void> {
      return this.http.delete<void>(`${_url}Products/${empID}`);
    }

    getproductsById(id: number): Observable<void> {
      const url = `${_url}Products/${id}`; // Correct URL construction
      return this.http.put<void>(url, this.httpOptions) // Pass EmployeeForm as the body
        .pipe(
          catchError(this.handleError<void>('getproductsById'))
        );
    }

    // getproductsByImageName(empName: string): Observable<void> {
    //   const url = `${_url}Products/GetProductByImageName/${empName}`; // Correct URL construction
    //   return this.http.put<void>(url, this.httpOptions) // Pass EmployeeForm as the body
    //     .pipe(
    //       catchError(this.handleError<void>('getproductsByImageName'))
    //     );
    // }

    getproductsByImageName(data: any): Observable<any> {
      const url = `${_url}Products/GetProductByImageName/${data}`;
      return this.http.get<any>(url);
    }
    
    
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); 
      return of(result as T);
    };
  }

}
