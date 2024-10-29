// import { Injectable } from '@angular/core';
// import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class NotifyService {
//   private hubConnection?: HubConnection;
//   private orderCountSubject = new BehaviorSubject<number>(0); // Holds order count
//   public orderCount$ = this.orderCountSubject.asObservable();

//   constructor() {
//     this.startConnection();
//   }

//   private startConnection() {
//     this.hubConnection = new HubConnectionBuilder()
//       .withUrl('http://localhost:5274/notificationHub') // Replace with your actual SignalR endpoint
//       .build();

//     this.hubConnection
//       .start()
//       .then(() => {
//         console.log('SignalR Connected');
//         // Set up listeners for the hub events
//         this.listenForOrderCountUpdates();
//         this.listenForCartUpdates();
//       })
//       .catch((err) => console.error('Error while starting connection: ' + err));
//   }

//   // Method to listen for order count updates from the SignalR hub
//   private listenForOrderCountUpdates() {
//     this.hubConnection?.on('ReceiveOrderCountUpdate', (newCount: number) => {
//       this.orderCountSubject.next(newCount); // Update the observable
//       console.log('Order count updated:', newCount);
//     });
//   }

//   // Method to listen for cart updates from the SignalR hub
//   private listenForCartUpdates() {
//     this.hubConnection?.on('ReceiveCartUpdate', (cartCount: number) => {
//       this.orderCountSubject.next(cartCount); // Update the order count (if you intend to use the same observable for both)
//       console.log(`Cart updated: ${cartCount} items in cart.`);
//     });
//   }

//   // Method to update the order count (can be called from other components/services)
// // Method to update the order count (can be called from other components/services)
// public updateOrderCount(count: number) {
//   this.orderCountSubject.next(count);
//   // Send this update to the SignalR hub if needed
//   this.hubConnection?.invoke('SendOrderCountUpdate', count)
//     .catch(err => console.error('Error while sending order count update: ' + err));
// }

// }

import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
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
      .withUrl('http://localhost:5274/notificationHub') // Replace with your actual SignalR endpoint
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected');
        this.listenForOrderCountUpdates();
        this.listenForCartUpdates();
      })
      .catch((err) => console.error('Error while starting connection: ' + err));

    // Handle disconnections
    this.hubConnection.onclose(async () => {
      console.log('SignalR Connection closed, attempting to reconnect...');
      await this.startConnection(); // Attempt to reconnect
    });
}


  private listenForOrderCountUpdates() {
    this.hubConnection?.on('ReceiveOrderCountUpdate', (newCount: number) => {
      this.orderCountSubject.next(newCount); // Update the observable
      console.log('Order count updated:', newCount);
    });
  }

  private listenForCartUpdates() {
    this.hubConnection?.on('ReceiveCartUpdate', (cartCount: number) => {
      this.orderCountSubject.next(cartCount); // Update the order count (if you intend to use the same observable for both)
      console.log(`Cart updated: ${cartCount} items in cart.`);
    });
  }

  // Method to update the order count (can be called from other components/services)
  // public updateOrderCount(count: number) {
  //   this.orderCountSubject.next(count);
  //   // Ensure the connection is established before invoking the method
  //   if (this.hubConnection?.state === 'Connected') {
  //     this.hubConnection.invoke('SendOrderCountUpdate', count)
  //       .catch(err => console.error('Error while sending order count update: ' + err));
  //   } else {
  //     console.warn('Cannot send data: SignalR connection is not connected');
  //   }
  // }
  public updateOrderCount(count: number) {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.invoke('SendOrderCountUpdate', count)
        .then(() => 
          console.warn('Order count sent:', count))
        .catch((err) => console.error('Error while sending order count update:', err));
     }
    else {
      console.log('Cannot send data: SignalR connection is not connected');
      setTimeout(() => this.updateOrderCount(count), 1000);
    }
  }
} 

