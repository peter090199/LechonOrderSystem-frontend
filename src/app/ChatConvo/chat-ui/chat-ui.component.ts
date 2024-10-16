import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chat-ui',
  templateUrl: './chat-ui.component.html',
  styleUrls: ['./chat-ui.component.css']
})
export class ChatUIComponent {

  @Output() close = new EventEmitter<void>();

  closeChat() {
    this.close.emit();
  }
  constructor() { }

}
