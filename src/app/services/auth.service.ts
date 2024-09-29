import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.authenticated.asObservable();

  constructor() {
    this.checkInitialAuthState();
  }

  private checkInitialAuthState() {
    const token = localStorage.getItem('authToken'); // Example logic
    this.authenticated.next(!!token);
  }

  login(username: string, password: string): boolean {
    // Implement your login logic here
    localStorage.setItem('authToken', 'your-token'); // Save token
    this.authenticated.next(true);
    return true;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.authenticated.next(false);
  }
}
