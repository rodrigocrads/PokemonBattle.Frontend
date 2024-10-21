import { Component, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'pokemonbattle.frontend';
  energiaTotal = 300;
  danoTotal = 0;

  constructor(
    @Inject('IWebSocket') public websocketService: WebsocketService 
  ) {}

  ngOnInit(): void {
    this.websocketService.messages.subscribe((msg: string) => {
      this.danoTotal += +msg;
      console.log(this.danoTotal);
    });
  }

  sendMessage() {
    this.websocketService.sendMessage('30');
  }

  calculaEnergia() {
    const energiaRestante = this.energiaTotal - this.danoTotal;
    const percentualEnergiaRestante = energiaRestante * 100 / this.energiaTotal;
    return `width: ${percentualEnergiaRestante}%`;
  }
}
