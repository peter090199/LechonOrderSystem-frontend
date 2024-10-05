import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardUiComponent } from './dashboard-ui/dashboard-ui.component';
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
import { UserPageComponent } from './header-page/user-page/user-page.component';
import { UserMenuPageComponent } from './header-page/user-menu-page/user-menu-page.component';
import { HomeComponent } from './Home/componentsUI/home/home.component';
import { ProductItemsComponent } from './Files/components/product-items/product-items.component';

const routes: Routes = [
  { path: '', redirectTo: '/userPage', pathMatch: 'full' },
  { path: 'userPage', component: UserMenuPageComponent },
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
        path: 'home', component: DashboardUiComponent,
        canActivate: [AuthGuard],
        data: { roles: ['user','admin'] }
      },
      {
        path: 'files/product/items', component: ProductItemsComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] }
      },
      { 
        path: 'files/clients', component: ClientsComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] }
       },
       { 
        path: 'menus/menu', component: HomeComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin','user'] }
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

