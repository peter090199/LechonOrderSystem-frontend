import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.loginService.isAuthenticated()) {
      const requiredRoles = route.data['roles'] as Array<string>;
      const userRole = this.loginService.getUserRole();
     // console.log(userRole)
      if (!requiredRoles || requiredRoles.length === 0 || requiredRoles.includes(userRole)) {
        return true; // User has required role
      } else {
        this.router.navigate(['/access-denied']); // Redirect to access denied
        return false;
      }
    } else {
      this.router.navigate(['/login']); // Redirect to login page
      return false;
    }
  }
}

