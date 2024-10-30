import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-frontend-payroll';
  isChatOpen = false;  // Boolean to track whether the chat window is open or closed

  // Function to toggle the chat window visibility
  toggleChat() {
    this.isChatOpen = !this.isChatOpen;  // Invert the current state of the chat window
  }


  // Optional function to close the chat window from within the chat component
  onCloseChat() {
    this.isChatOpen = false;  // Explicitly set the chat window state to closed
  }
}
