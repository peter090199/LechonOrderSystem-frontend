// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { ProductOrderService } from '../services/product-order.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable(); // Observable for other components

  constructor(private productOrderService: ProductOrderService) {}

  addProductToCart(product: any) {
    return this.productOrderService.addProductToCart(product).pipe(
      tap(() => {
        // Increase cart count and emit new value
        const currentCount = this.cartCount.value;
        this.cartCount.next(currentCount + 1);
      })
    );
  }

  // Optional: Method to reset or set cart count (e.g., on loading the app)
  setCartCount(count: number) {
    this.cartCount.next(count);
  }
}
