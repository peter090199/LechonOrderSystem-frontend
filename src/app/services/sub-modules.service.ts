import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class SubModulesService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}
  private _refreshrequired = new Subject<void>();

  get RequiredRefresh() {
    return this._refreshrequired;
  }
   // save 
   SavedSubModule(moduledata: any): Observable<any>{
    return this.http.post<any>(_url+'SubModules/SaveSubModule',moduledata).pipe(
      tap(()=>{
        this.RequiredRefresh.next();
      }),
      catchError(this.handleError<any>('SubModules/SaveSubModule'))
    );
  }
  GetSubModuleByID(moduleId: number): Observable<any> {
    const url = `${_url}SubModules/GetSubModuleById/${moduleId}`;
    
    return this.http.get<any>(url).pipe(
      catchError(this.handleError<any>('GetSubModuleByID')) // Handle errors
    );
  }
  
  GetSubModules(): Observable<any> {
  return this.http.get<any>(_url+"SubModules/GetSubModules").pipe(
    catchError(this.handleError<void>('SubModules/GetSubModules'))
  );
}

  
private handleError<T>(_operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.error(error); 
    return of(result as T);
  };
}
}
