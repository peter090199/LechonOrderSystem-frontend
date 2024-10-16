import { Breakpoints } from '@angular/cdk/layout';
import { Component, HostListener, AfterViewInit ,ViewEncapsulation } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NotificationsService } from 'src/app/Global/notifications.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductDetailsComponent } from 'src/app/Home/componentsUI/product-details/product-details.component';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { ProductOrderService } from 'src/app/services/product-order.service';
import { RegisterService } from 'src/app/services/register.service';
import { UserViewProductsComponent } from './user-view-products/user-view-products.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-user-homepage',
  templateUrl: './user-homepage.component.html',
  styleUrls: ['./user-homepage.component.css'],
  animations: [
    trigger('scrollAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }), // Start from below
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })) // Slide up and fade in
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({ opacity: 0, transform: 'translateY(20px)' })) // Slide down and fade out
      ])
    ]),
      trigger('scrollFadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }), // Start with opacity 0 and shifted down
        animate('0.5s ease-in', style({ opacity: 1, transform: 'translateY(0)' }))  // Fade in and move up
      ])
    ])
  ]

})
export class UserHomepageComponent implements AfterViewInit  {
  isMobile : boolean = false;
  placeHolder       : string = "Search";
  searchKey         : string = "";
  isLoading: boolean = true;
  userName:any;
  userId: number = 0;
  visibleCards: boolean = true;

  constructor(private breakpointObserver: BreakpointObserver,
    private alert:NotificationsService, private dialog : MatDialog,
    private router:Router,
    private products:ProductsService,
    private countOrder:ProductOrderService,
    private users:RegisterService
  ) {
  }

  ngAfterViewInit() {
    this.onScroll(); // Check on init
  }


  @HostListener('window:scroll', [])
  onScroll() {
    const elements = document.querySelectorAll('.description, .product-card');
    const windowHeight = window.innerHeight;

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Check if the element is in view
      if (rect.top < windowHeight && rect.bottom > 0) {
        el.classList.add('visible'); // Add visible class if in view
      } else {
        el.classList.remove('visible'); // Remove visible class if out of view
      }
    });
  }


  // getAnimationDelay(id: string): string {
  //   const delays: { [key: string]: string } = {
  //     'mat-card1': '0.1s',
  //     'mat-card2': '0.5s',
  //     'mat-card3': '1s'
  //   };
  //   return delays[id] || '0s'; // Default to '0s' if id is not found
  // }
  getAnimationDelay(cardId: string): string {
    // Calculate delay based on card ID or index; for demonstration, returning '0s'
    return '0s';
  }

  notificationCount: number | undefined;
  pigStages:any=[];

  ngOnInit(): void {
   // this.loadUserId();
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
    });
    this.loadProducts();
  }
  getImagePath(imgUrl: string): string {
    const baseUrl = 'http://localhost:5274/api/Images/'; // Adjust this to your API base URL
    return baseUrl + imgUrl;
 }


async loadProducts(): Promise<void> {
  try {
    this.isLoading = true;
    this.pigStages = await firstValueFrom(this.products.getEmployees());
    //console.log(this.pigStages)

    this.pigStages.data = this.pigStages;
    this.isLoading = false;

  } catch (error) {
    console.error('Error fetching employee data:', error);
    this.isLoading = false;
  }
}



applyFilter(){
 this.pigStages.filter = this.searchKey.trim().toLocaleLowerCase();
}

clearSearch(){
  this.searchKey = "";
  this.applyFilter();

}

 ViewDetails(): void {
  const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    //dialogConfig.data = stage;
    const dialogRef = this.dialog.open(UserViewProductsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       // this.loadProducts(); // Refresh the table after dialog closure
      }
    });
  }

// ViewDetails(stage:any): void {
//   const dialogConfig = new MatDialogConfig();
//   dialogConfig.disableClose = true;
//   dialogConfig.autoFocus = true;
//   dialogConfig.width = '900px';
//   dialogConfig.data = stage;
//   const dialogRef = this.dialog.open(ProductDetailsComponent, dialogConfig);
//   dialogRef.afterClosed().subscribe(result => {
//     if (result) {
//      // this.loadProducts(); // Refresh the table after dialog closure
//     }
//   });
// }
ViewOrder():void{
  this.router.navigate(['header/home/view-order']); 
}

}
