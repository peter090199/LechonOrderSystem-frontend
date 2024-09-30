import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { firstValueFrom, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoginService } from '../services/login.service';
import { MenusService } from '../services/menus.service';
import { SubModulesService } from '../services/sub-modules.service';
import { Router } from '@angular/router';
import { _systemTitle } from 'src/global-variables';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AccessrightsService } from '../services/accessrights.service';
import { RegisterService } from '../services/register.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrls: ['./header-page.component.css'],

})
export class HeaderPageComponent implements OnInit {

  animateCards = false;
  systemTitle : string = _systemTitle;

  triggerAnimation() {
    this.animateCards = !this.animateCards; // Toggle to trigger animation
  }
  isLoading = true; // Start with loading true
  onNavItemClick(sidenav: MatSidenav) {
    // sidenav.close();
  }
  isClicked = false;

  handleClick() {
    this.isClicked = !this.isClicked;
    setTimeout(() => {
      this.isClicked = false; // Reset after the transition
    }, 300); 
  }
  isMobile$!: Observable<boolean>;

  accessRights: { moduleId: number; subModuleId: number; }[] = [];
  Modules : any = [];
  SubModules : any = [];
  
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild(MatSort) matSort!:MatSort;

  constructor(private breakpointObserver: BreakpointObserver,private logoutService:LoginService,
    private modulesService:MenusService,private subModulesService:SubModulesService, public router: Router,
    private accessRightsService:AccessrightsService,private userService:RegisterService,
    private sharedService: SharedService
  )
   {
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
     this.loadData();
   }

   userRole: string = '';  // User role will be assigned here
   //accessRightss: any=[]; // Store access rights from service
   userServices:any=[];
   username: any;
   users:string='';

   ngOnInit(): void {
    this.username = this.logoutService.getUsername();
    if (this.username) {
      this.loadUserAndModules();
    } else {
      console.error('Username not found in token');
    }
  }
  

  async loadUserAndModules(): Promise<void> {
    try {
      const user = await firstValueFrom(this.userService.getUserByUsername(this.username));
      this.userRole = user.role.toLowerCase(); // Use 'admin' or 'user'
     
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
        console.log(this.userRole)
        this.Modules = allModules.filter((module: { moduleName: any; }) =>
          ['profile','home','services'].includes(module.moduleName.toLowerCase())
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
  
async GetModules(): Promise<void> {
  try {
    const allModules = await firstValueFrom(this.modulesService.getModules());
    const allSubModules = await firstValueFrom(this.subModulesService.GetSubModules());
    
    // Filter modules based on access rights

    this.Modules = allModules.filter((module: any) => 
      this.accessRights.some((right: any) => right.moduleId === module.moduleId)
  
    );
  
    // Filter submodules based on access rights
    this.SubModules = allSubModules.filter((submodule: any) => 
      this.accessRights.some((right: any) => right.subModuleId === submodule.subModuleId)
    );
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


  loadData() {
    // Simulate loading with a timeout (replace this with actual data fetching)
    setTimeout(() => {
      this.isLoading = false; // Set loading to false after data is fetched
    }, 3000); // Adjust time as necessary
  }
  
  logout() {
    this.logoutService.logout();
  }

}