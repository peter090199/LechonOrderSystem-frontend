import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoginService } from 'src/app/services/login.service';
import { MenusService } from 'src/app/services/menus.service';
import { SubModulesService } from 'src/app/services/sub-modules.service';
import { Router } from '@angular/router';
import { _systemTitle } from 'src/global-variables';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AccessrightsService } from 'src/app/services/accessrights.service';
import { RegisterService } from 'src/app/services/register.service';
import { SharedService } from 'src/app/shared.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;
  isMobile: boolean = true;

  notificationCount = 5; // Example count; you can dynamically update this value

  // Method to update notification count dynamically
  updateNotificationCount(count: number) {
    this.notificationCount = count;
  }

  constructor(private breakpointObserver: BreakpointObserver,
    private logoutService:LoginService,
    private modulesService:MenusService,
    private subModulesService:SubModulesService, 
    public router: Router,
    private accessRightsService:AccessrightsService,
    private userService:RegisterService,
    private sharedService: SharedService

  ) {
   
  }

  userRole: string = '';  // User role will be assigned here
  userServices:any=[];
  username: any;
  users:string='';
  
  accessRights: { moduleId: number; subModuleId: number; }[] = [];
  Modules : any = [];
  SubModules : any = [];
  systemTitle : string = _systemTitle;
  
  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
    this.isMobile = window.innerWidth <= 768;
    
    this.username = this.logoutService.getUsername();
   // console.log('Username:', this.username);
    if (this.username) {
      this.loadUserAndModules();
    } else {
      console.error('Username not found in token');
    }
   
  }
  onModuleClick() {
    if (this.isMobile) {
      this.drawer.close();
    }
  }
  async loadUserAndModules(): Promise<void> {
    try {
      const user = await firstValueFrom(this.userService.getUserByUsername(this.username));
      this.userRole = user.role.toLowerCase(); // Use 'admin' or 'user'
    //  console.log('User Role:', this.userRole);

      this.accessRights = await firstValueFrom(this.accessRightsService.getAccessRights());
      this.loadModulesAndSubModules();
    } catch (error) {
      console.error('Error fetching user or modules:', error);
    }
  }
  async loadModulesAndSubModules(): Promise<void> {
    try {
      // Fetch modules and submodules
      const [allModules, allSubModules] = await Promise.all([
        firstValueFrom(this.modulesService.getModules()),
        firstValueFrom(this.subModulesService.GetSubModules())
      ]);
  
      // Store fetched data in localStorage
      localStorage.setItem('modules', JSON.stringify(allModules));
      localStorage.setItem('subModules', JSON.stringify(allSubModules));
  
      // Determine the modules and submodules to display based on userRole
      if (this.userRole.toLowerCase() === 'admin') {
        this.Modules = allModules;
        this.SubModules = allSubModules;
      } 
      else if (this.userRole.toLowerCase() === 'user') {
        this.Modules = allModules.filter((module: { moduleName: string; }) =>
          ['profile','home','community','services'].includes(module.moduleName.toLowerCase())
        );
        this.SubModules = allSubModules.filter((submodule: any) => 
          this.accessRights.some((right: any) => right.subModuleId === submodule.subModuleId)
        );
      }
      else if (this.userRole.toLowerCase() === 'staff') {
        this.Modules = allModules.filter((module: { moduleName: string; }) =>
          ['attendance','profile'].includes(module.moduleName.toLowerCase())
        );
        this.SubModules = allSubModules.filter((submodule: any) => 
          this.accessRights.some((right: any) => right.subModuleId === submodule.subModuleId)
        );
      }
    } catch (error) {
      console.error('Error fetching modules or submodules:', error);
    }
  }
  
  getPath(module:string){
    module        =  module.replace(' ', '');
    module        =  module.replace(' ', '');
      
    var data:string   = this.router.url;
    var data2:any     = (data.split('/'));
    let route         = data2[data2.length - 2].replace(/[^\w\s]/gi, '');
    var route2        = route.replace(/[0-9]/g, '');

    return route2 == module;
  }

  logout() {
    this.logoutService.logout();
  }

}
