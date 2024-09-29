import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, Subject, tap } from 'rxjs';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class AccessrightsService {
  getModulesByAccessRight(accessRightId: number): Observable<any> {
    return this.http.get<any>(`${_url}AccessRightSubModules/GetSubModulesByAccessRight/${accessRightId}`);
  }

  getSubModulesByAccessRight(accessRightId: number): Observable<any> {
    return this.http.get<any>(`${_url}AccessRightSubModules/GetSubModulesByAccessRight/${accessRightId}`);
  }

  constructor( private http: HttpClient,) { }

  private _refreshrequired = new Subject<void>();
  get RequiredRefresh() {
    return this._refreshrequired;
  }

  saveUserAccess(accessRightName: any): Observable<any>{
    return this.http.post<any>(_url+'UserAccessrights',accessRightName).pipe(
      tap(()=>{
        this.RequiredRefresh.next();
      }),
      catchError(this.handleError<any>('UserAccessrights'))
    );
  }
   
  getAccessRights(): Observable<any> {
    return this.http.get<any>(_url+"UserAccessrights/GetAccessRights");
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); 
      return of(result as T);
    };
  }
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${_url}UserAccessrights/DeleteAccess/${id}`);
  }
  
}
