import { Component, OnDestroy } from '@angular/core';
import { LojaService, Produto } from '../../services/loja.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service'; // ✅ Import do AuthService

@Component({
  selector: 'app-favoritos',
  standalone: false,
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnDestroy {
  lista: Produto[] = [];
  private sub!: Subscription;
  ordenacao: string = 'data';

  constructor(
    private loja: LojaService,
    private router: Router,
    private authService: AuthService // ✅ Injetado AuthService
  ) {}

  ionViewWillEnter() {
    this.sub = this.loja.favoritos$.subscribe(favoritos => {
      this.lista = favoritos;
      this.ordenarFavoritos();
    });
  }

  ordenarFavoritos() {
    if (this.ordenacao === 'preco') {
      this.lista.sort((a, b) => a.valor - b.valor);
    } else if (this.ordenacao === 'data') {
      this.lista.sort((a, b) => {
        const dataA = a.dataAdicao ? a.dataAdicao.getTime() : 0;
        const dataB = b.dataAdicao ? b.dataAdicao.getTime() : 0;
        return dataA - dataB;
      });
    }
  }

  remover(produto: Produto) {
    this.loja.removerFavoritoPorNome(produto.nome);
  }

  async adicionarFavorito(produto: Produto) {
    if (!this.authService.isLogado()) {
      alert('Você precisa estar logado para adicionar aos favoritos.');
      return;
    }

    this.loja.adicionarFavorito(produto);
    console.log('Adicionado aos favoritos:', produto);
  }

  async adicionarNaSacola(produto: Produto) {
    if (!this.authService.isLogado()) {
      alert('Você precisa estar logado para adicionar à sacola.');
      return;
    }

    this.loja.adicionarSacola(produto);
    console.log('Adicionado à sacola:', produto);
  }

  irParaSacola() {
    this.router.navigate(['/sacola']);
  }

  voltar() {
    history.back();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
