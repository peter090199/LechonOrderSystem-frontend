import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  private hubConnection?: HubConnection;
  private orderCountSubject = new BehaviorSubject<number>(0); // Holds order count
  public orderCount$ = this.orderCountSubject.asObservable();
  constructor() {
    this.startConnection();
  }

  private startConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5274/orderHub') // Replace with your actual SignalR endpoint
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected');
        this.hubConnection?.on('ReceiveOrderCountUpdate', (newCount: number) => {
          this.orderCountSubject.next(newCount); // Update the observable
          console.log('Order count updated:', newCount);
        });
      })
      .catch((err) => console.error('Error while starting connection: ' + err));
  }
  // Method to update the order count
  updateOrderCount(count: number) {
    this.orderCountSubject.next(count);
  }
}
