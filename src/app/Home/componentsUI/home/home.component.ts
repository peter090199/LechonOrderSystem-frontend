import { Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isMobile : boolean = false;

  constructor(private breakpointObserver: BreakpointObserver

  ) { }
  
  pigStages = [
    { name: '1 month old piglet', imgUrl: 'assets/R.jpg' },
    { name: '3 - 6 months pig', imgUrl: 'assets/3 - 6 months pig.jpg' },
    { name: '8 - 10 months pig', imgUrl: 'assets/8 - 10 months pig.jpg' },
    { name: 'Sow', imgUrl: 'assets/Sow.jpg' },
    { name: 'Letchon', imgUrl: 'assets/Letchon.jpg' },
    { name: 'Butchered Pig', imgUrl: 'assets/R.jpg' },
    { name: 'Sow Laboring', imgUrl: 'assets/R.jpg' }
  ];

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

}
