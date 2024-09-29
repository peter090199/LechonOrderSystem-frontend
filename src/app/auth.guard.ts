// // import { Injectable } from '@angular/core';
// // import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// // import { Observable, of } from 'rxjs';
// // import { map, tap, catchError } from 'rxjs/operators';
// // import { LoginService } from './services/login.service';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class AuthGuard implements CanActivate {

// //   constructor(private loginService: LoginService, private router: Router) {}

// //   canActivate(
// //     route: ActivatedRouteSnapshot,
// //     state: RouterStateSnapshot
// //   ): Observable<boolean> | Promise<boolean> | boolean {
// //     return this.loginService.isAuthenticated() ? this.checkRole(route) : this.handleUnauthorized();
// //   }

// //   private checkRole(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
// //     const requiredRoles = route.data['roles'] as Array<string>; // Roles required for the route
// //     const userRole = this.loginService.getUserRole(); // Get role from service or token

// //   //   if (!requiredRoles || requiredRoles.length === 0 || requiredRoles.includes(userRole)) {
// //   //     return true; // User has required role or no role is required
// //   //   }

// //   //   // User does not have the required role
// //   //  this.router.navigate(['/access-denied']); // Redirect to an access denied page
// //    return false;
// //   }

// //   private handleUnauthorized(): boolean {
// //     this.loginService.handleUnauthorizedError(); // Auto-logout if the token is expired
// //     this.router.navigate(['/login']); // Redirect to login page
// //     return false;
// //   }
// // }

// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { LoginService } from './services/login.service';// Import your login service

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor(private loginService: LoginService, private router: Router) {}

//   canActivate(): boolean {
//     if (this.loginService.isAuthenticated()) {
//       return true;
//     } 
//     else
//      {
//       this.router.navigate(['/login']);
//       return false;
//     }
//   }
// }
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
      console.log(userRole)
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

