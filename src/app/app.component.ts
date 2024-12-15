import { Component, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';

type Pokemon = {
  Name?: string;
  Stats: { Hp: number; Damage: number; }
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
  playerId = '';
  meuPokemonEscolhido: Pokemon = { Stats: { Hp: 0, Damage: 0 }};
  pokemonOponenteEscolhido: Pokemon = { Stats: { Hp: 0, Damage: 0 }};

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
      console.log("atualizando ... meu pokemon", this.meuPokemonEscolhido);
      const dadosOponente = jsonMensagem.Player1.Id !== this.playerId
        ? jsonMensagem.Player1
        : jsonMensagem.Player2;
      this.pokemonOponenteEscolhido = dadosOponente.Pokemon;
    });

    setTimeout(() => this.websocketService.sendMessage(JSON.stringify({type: 'REGISTER_PLAYER_ID', playerId: this.playerId, jogada: {}})), 5000);
    const jsonString = JSON.stringify({name: "blastoise", hp: 350, atk: 400 });
    //setTimeout(() => this.websocketService.sendMessage(JSON.stringify({type: 'REGISTER_PLAYER_ID', value: jsonString })), 5000);
  }

  get pokemonOponenteEscolhidoImage() {
    return `https://projectpokemon.org/images/normal-sprite/${this.pokemonOponenteEscolhido?.Name}.gif`
  }

  get meuPokemonEscolhidoImage() {
    return `https://projectpokemon.org/images/sprites-models/normal-back/${this.meuPokemonEscolhido?.Name}.gif`;
  }
  
  sendMessage() {
    const message = JSON.stringify({
      type: 'SELECTED_MOVE',
      playerId: this.playerId,
      value: 'surf'
    });
    console.log(message);
    this.websocketService.sendMessage(message);
  }

  calculaEnergiaPokemonOponente() {
    const energiaRestante = this.pokemonOponenteEscolhido.Stats.Hp - this.pokemonOponenteEscolhido.Stats.Damage;
    const percentualEnergiaRestante = energiaRestante * 100 / this.pokemonOponenteEscolhido.Stats.Hp;
    return `width: ${percentualEnergiaRestante}%`;
  }

  calculaEnergiaMeuPokemon() {
    const energiaRestante = this.meuPokemonEscolhido.Stats.Hp - this.meuPokemonEscolhido.Stats.Damage;
    const percentualEnergiaRestante = energiaRestante * 100 / this.meuPokemonEscolhido.Stats.Hp;
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
