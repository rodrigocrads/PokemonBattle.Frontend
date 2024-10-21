import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
  private socket!: WebSocket;
  private messageSubject: Subject<any> = new Subject();

  constructor() {
    this.connect();
  }

  private connect() {
    this.socket = new WebSocket('ws://localhost:5059/event-battle');

    this.socket.onopen = () => {
      console.log('Conexão estabelecida');
    };

    this.socket.onmessage = (event) => {
      this.messageSubject.next(event.data);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error', error);
    };

    this.socket.onclose = () => {
      console.log('Conexão fechada. Tentando reconectar...');
      setTimeout(() => this.connect(), 1000); // Tenta reconectar após 1 segundo
    };
  }

  sendMessage(message: string) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket não está aberto. Mensagem não enviada:', message);
    }
  }

  get messages() {
    return this.messageSubject.asObservable();
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
