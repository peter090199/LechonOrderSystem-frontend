import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class ProductOrderService {

  constructor(private http: HttpClient) { }

  addProductToCart(product: any): Observable<any> {
    const url = `${_url}ProductsOrder`; 
    return this.http.post(url, product);
  }

  getAllOrders(): Observable<any> {
    const url = `${_url}ProductsOrder/GetProductsOrder`; 
    return this.http.get<any>(url);  
  }

  
  getOrderByUserId(userId:number): Observable<any> {
    const url = `${_url}ProductsOrder/GetProductsOrderById/${userId}`; 
    return this.http.get<any>(url);  
  }

  GetCountsOrderById(userId:number): Observable<any> {
    const url = `${_url}ProductsOrder/GetCountsOrderById/${userId}`; 
    return this.http.get<any>(url);  
  }



}
