import { Component, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';

type Pokemon = {
  Name?: string;
}

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
  playerId = '';
  meuPokemonEscolhido: Pokemon = {};
  pokemonOponenteEscolhido: Pokemon = {};

  constructor(
    @Inject('IWebSocket') public websocketService: WebsocketService 
  ) {
    this.playerId = this.idGenerator();
  }

  ngOnInit(): void {
    this.websocketService.messages.subscribe((msg: string) => {
      const jsonMensagem = JSON.parse(msg);
      console.log(jsonMensagem);
      const dadosJogador = jsonMensagem.Player1.Id === this.playerId
        ? jsonMensagem.Player1
        : jsonMensagem.Player2;
      this.meuPokemonEscolhido = dadosJogador.Pokemon;
      const dadosOponente = jsonMensagem.Player1.Id !== this.playerId
        ? jsonMensagem.Player1
        : jsonMensagem.Player2;
      this.pokemonOponenteEscolhido = dadosOponente.Pokemon;
    });

    setTimeout(() => this.websocketService.sendMessage(JSON.stringify({type: 'REGISTER_PLAYER_ID', value: this.playerId})), 3000)
  }

  get pokemonOponenteEscolhidoImage() {
    return `https://projectpokemon.org/images/normal-sprite/${this.pokemonOponenteEscolhido?.Name}.gif`
  }

  get meuPokemonEscolhidoImage() {
    return `https://projectpokemon.org/images/sprites-models/normal-back/${this.meuPokemonEscolhido?.Name}.gif`;
  }
  
  sendMessage() {
    this.websocketService.sendMessage(JSON.stringify({type: 'ATK', value: 30}));
  }

  calculaEnergia() {
    const energiaRestante = this.energiaTotal - this.danoTotal;
    const percentualEnergiaRestante = energiaRestante * 100 / this.energiaTotal;
    return `width: ${percentualEnergiaRestante}%`;
  }

  private idGenerator(): string {
    const isString = `${this.S4()}${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}${this.S4()}${this.S4()}`;

    return isString;
  }

  private S4(): string {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
}
