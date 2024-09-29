import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { _url } from 'src/global-variables';
import { Modules } from '../Model/Modules';

@Injectable({
  providedIn: 'root'
})
export class MenusService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  private _refreshrequired = new Subject<void>();

  get RequiredRefresh() {
    return this._refreshrequired;
  }
  // save 
  postModule(moduledata: any): Observable<any>{
  return this.http.post<any>(_url+'Modules/SavedModules',moduledata).pipe(
    tap(()=>{
      this.RequiredRefresh.next();
    }),
    catchError(this.handleError<any>('Modules/SavedModules'))
  );
}

updateModule(moduledata: any, id: number): Observable<void> {
  const url = `${_url}Modules/UpdateModule/${id}`; // Correct URL construction
  return this.http.put<void>(url, moduledata) // Pass EmployeeForm as the body
    .pipe(
      catchError(this.handleError<void>('updateModule'))
    );
}

getModules(): Observable<any> {
  return this.http.get<any>(_url+"Modules/GetModules").pipe(
    catchError(this.handleError<void>('Modules/GetModules'))
  );
}
  
deleteModule(id: number): Observable<void> {
  return this.http.delete<void>(`${_url}Modules/DeleteModule/${id}`);
}

private handleError<T>(_operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.error(error); 
    return of(result as T);
  };
}


}
