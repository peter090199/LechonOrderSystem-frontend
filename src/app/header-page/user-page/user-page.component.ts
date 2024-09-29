// import { Component, OnInit } from '@angular/core';
// import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';  

// @Component({
//   selector: 'app-user-page',
//   templateUrl: './user-page.component.html',
//   styleUrls: ['./user-page.component.css']
// })
// export class UserPageComponent implements OnInit {
//   public isMobile: boolean = true;
//  drawer: any;

//   constructor(private breakpointObserver: BreakpointObserver) {
//     this.breakpointObserver
//       .observe([Breakpoints.Handset]) // Observing if the screen is a handset (mobile)
//       .subscribe((result) => {
//         this.isMobile = result.matches; // Update the isMobile variable based on the result
//       });
//   }
//   ngOnInit(): void {
//   }

// }
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  isLoading = true; // Start with loading true
  onNavItemClick(sidenav: MatSidenav) {
    sidenav.close();
    
  }
  isClicked = false;

  handleClick() {
    this.isClicked = !this.isClicked;
    setTimeout(() => {
      this.isClicked = false; // Reset after the transition
    }, 300); 
  }
  isMobile$!: Observable<boolean>;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
    this.loadData();
  }
  loadData() {
    // Simulate loading with a timeout (replace this with actual data fetching)
    setTimeout(() => {
      this.isLoading = false; // Set loading to false after data is fetched
    }, 3000); // Adjust time as necessary
  }
}