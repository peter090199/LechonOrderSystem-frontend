import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-view-products',
  templateUrl: './user-view-products.component.html',
  styleUrls: ['./user-view-products.component.css']
})
export class UserViewProductsComponent implements OnInit {

  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;

  constructor(
    private routes: Router,
    private dialogRef: MatDialogRef<UserViewProductsComponent> // Added the component type here
  ) { }

  ngOnInit(): void {
  }

  Register() {
    this.routes.navigateByUrl("/register");
    this.dialogRef.close(); 
  }

  Login() {
    this.routes.navigateByUrl("/login");
    this.dialogRef.close();  // Use dialogRef.close() to close the dialog properly
  }
}
