// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { DashboardUiComponent } from './dashboard-ui/dashboard-ui.component';
// import { EmployeesComponent } from './Files/components/employees/employees.component';
// import { RegisterComponent } from './register/register.component';
// import { LoginComponent } from './login/login.component';
// import { AuthGuard } from './auth.guard';
// import { ProtectedComponent } from './protected/protected.component';
// import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
// import { HeaderPageComponent } from './header-page/header-page.component';
// import { ClientsComponent } from './Files/components/clients/clients.component';
// import { UserRoleComponent } from './Users/componentsTable/user-role.component';
// import { AccessrightsComponent } from './Users/componentsTable/accessrights.component';
// import { MenusTableComponent } from './Users/componentsTable/menus-table.component';

// const routes: Routes = [
//   { path: '', redirectTo: '/login', pathMatch: 'full' },
//   { path: 'register', component: RegisterComponent }, // Accessible to everyone
//   { path: 'login', component: LoginComponent }, // Accessible to everyone

//   // Protected route (accessible to both admin and user roles)
//   { 
//     path: 'protected-route', 
//     component: ProtectedComponent, 
//     canActivate: [AuthGuard], 
//     data: { roles: ['admin', 'user'] } 
//   },

//   // Routes requiring authentication
//   {
//     path: '',
//     canActivate: [AuthGuard],
//     children: [
//       {
//         path: 'header',
//         component: HeaderPageComponent,
//         data: { roles: ['admin'] }, // Admin access only
//         children: [
//           { path: 'dashboard', component: DashboardUiComponent, data: { roles: ['admin'] } },
//           { path: 'files/employees', component: EmployeesComponent, data: { roles: ['admin'] } },
//           { path: 'files/clients', component: ClientsComponent, data: { roles: ['admin', 'user'] }}, // Admin & User access
//           { path: 'user/role', component: UserRoleComponent, data: { roles: ['admin'] } },
//           { path: 'user/accessrights', component: AccessrightsComponent, data: { roles: ['admin'] } },
//           { path: 'user/menus', component: MenusTableComponent, data: { roles: ['admin'] } },
//         ]
//       }
//     ]
//   },
  
//   // Wildcard route for 404 page
//   { path: '**', component: PageNotFoundComponent }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardUiComponent } from './dashboard-ui/dashboard-ui.component';
import { EmployeesComponent } from './Files/components/employees/employees.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { ProtectedComponent } from './protected/protected.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderPageComponent } from './header-page/header-page.component';
import { ClientsComponent } from './Files/components/clients/clients.component';
import { UserRoleComponent } from './Users/componentsTable/user-role.component';
import { AccessrightsComponent } from './Users/componentsTable/accessrights.component';
import { MenusTableComponent } from './Users/componentsTable/menus-table.component';
import { LandingPageComponent } from './lay-out/landing-page/landing-page.component';
import { UserProfileUIComponent } from './Profile/ComponentsUI/user-profile-ui/user-profile-ui.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent }, // Accessible to everyone
  { path: 'login', component: LoginComponent }, // Accessible to everyone

  // Protected route (accessible to both admin and user roles)
  { 
    path: 'protected', 
    component: ProtectedComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['admin', 'user'] } 
  },

  // Routes requiring authentication
  {
    path: 'header',
    component: LandingPageComponent,
    canActivate: [AuthGuard],
    children: [
      { 
        path: 'dashboard', component: DashboardUiComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'files/employees', component: EmployeesComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] }
      },
      { 
        path: 'files/clients', component: ClientsComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] }
       },
      { 
        path: 'user/role', component: UserRoleComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] }
      },
      { 
        path: 'user/accessrights', component: AccessrightsComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] }
      },
      { 
        path: 'user/menus', component: MenusTableComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] }
      },
      {
         path: 'user/profile', component: UserProfileUIComponent,
         canActivate: [AuthGuard],
         data: { roles: ['admin', 'user']}
      }
    ]
  },
  
  // Wildcard route for 404 page
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

