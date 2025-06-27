import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FreteService {

  private cepOrigem = '21042-090'; // CEP fixo da loja JK

  constructor() { }

  calcularFrete(cepDestino: string): { valor: number, prazo: number } {
    const cepDestinoLimpo = cepDestino.replace(/\D/g, '');

    if (cepDestinoLimpo.length !== 8) {
      return { valor: 0, prazo: 0 }; // CEP inválido
    }

    const prefixoOrigem = parseInt(this.cepOrigem.substring(0, 5), 10);
    const prefixoDestino = parseInt(cepDestinoLimpo.substring(0, 5), 10);

    const distancia = Math.abs(prefixoDestino - prefixoOrigem);

    // Valor do frete: base 10 + variação proporcional, nunca abaixo de 10
    const valor = Math.max(10, 10 + (distancia / 100));

    // Prazo de entrega: entre 2 e 20 dias úteis, proporcional à distância
    const prazo = Math.min(20, Math.max(2, Math.ceil(distancia / 50)));

    return {
      valor: parseFloat(valor.toFixed(2)),
      prazo
    };
  }
}
