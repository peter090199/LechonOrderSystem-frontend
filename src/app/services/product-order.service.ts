// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, tap, of, throwError } from 'rxjs';
// import { _url } from 'src/global-variables';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductOrderService {

//   private cartCount = new BehaviorSubject<number>(0); // Real-time cart count observable
//   cartCount$ = this.cartCount.asObservable();

//   constructor(private http: HttpClient) { }

//   // addProductToCart(product: any): Observable<any> {
//   //   const url = `${_url}ProductsOrder`; 
//   //   return this.http.post(url, product);
//   // }
//   // Add product to cart and refresh cart count and total amount
//   addProductToCart(product: any): Observable<any> {
//     const url = `${_url}ProductsOrder`; 
//     return this.http.post(url, product).pipe(
//       tap(() => {
//         this.refreshCartData(product.userId); // Refresh data after adding a product
//       })
//     );
//   }

//   getAllOrders(): Observable<any> {
//     const url = `${_url}ProductsOrder/GetProductsOrder`; 
//     return this.http.get<any>(url);  
//   }

  
//   getOrderByUserId(userId:number): Observable<any> {
//     const url = `${_url}ProductsOrder/GetProductsOrderById/${userId}`; 
//     return this.http.get<any>(url);  
//   }

//   GetCountsOrderById(userId:number): Observable<any> {
//     const url = `${_url}ProductsOrder/GetCountsOrderById/${userId}`; 
//     return this.http.get<any>(url);  
//   }
//   DeleteProductOrder(orderId: number): Observable<void> {
//     return this.http.delete<void>(`${_url}ProductsOrder/${orderId}`);
//   }
//   GetTotalAmountByUser(userId:number): Observable<any> {
//     const url = `${_url}ProductsOrder/GetTotalAmountByUser/${userId}`; 
//     return this.http.get<any>(url);  
//   }


// }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class ProductOrderService {
  private cartCount = new BehaviorSubject<number>(0); // Real-time cart count observable
  cartCount$ = this.cartCount.asObservable();

  private totalAmount = new BehaviorSubject<number>(0); // Real-time total amount observable
  totalAmount$ = this.totalAmount.asObservable();

  constructor(private http: HttpClient) {}

  // Add product to cart and refresh cart count and total amount
  addProductToCart(product: any): Observable<any> {
    const url = `${_url}ProductsOrder`; 
    return this.http.post(url, product).pipe(
      tap(() => {
        this.refreshCartData(product.userId); // Refresh data after adding a product
      })
    );
  }

  // Delete product order and refresh cart data
  DeleteProductOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${_url}ProductsOrder/${orderId}`);
  }

  // Get all orders
  getAllOrders(): Observable<any> {
    const url = `${_url}ProductsOrder/GetProductsOrder`; 
    return this.http.get<any>(url);  
  }

  // Get orders by user ID
  getOrderByUserId(userId: number): Observable<any> {
    const url = `${_url}ProductsOrder/GetProductsOrderById/${userId}`; 
    return this.http.get<any>(url);  
  }

  // Load and update cart count and total amount based on user ID
  private refreshCartData(userId: number) {
    this.getCountsOrderById(userId).subscribe(count => this.cartCount.next(count));
    this.getTotalAmountByUser(userId).subscribe(amount => this.totalAmount.next(amount));
  }

  // Get cart count by user ID
  getCountsOrderById(userId: number): Observable<number> {
    const url = `${_url}ProductsOrder/GetCountsOrderById/${userId}`; 
    return this.http.get<number>(url);  
  }

  // Get total amount by user ID
  getTotalAmountByUser(userId: number): Observable<number> {
    const url = `${_url}ProductsOrder/GetTotalAmountByUser/${userId}`; 
    return this.http.get<number>(url);  
  }
}

