import { Component, OnDestroy, OnInit } from '@angular/core';
import { LojaService, Produto } from '../../services/loja.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router'; // ✅ Adicionado

@Component({
  selector: 'app-produtos',
  standalone: false,
  templateUrl: './produtos.page.html',
  styleUrls: ['./produtos.page.scss'],
})
export class ProdutosPage implements OnInit, OnDestroy {
  filtroOrdenacao: string = 'relevancia';  // Filtro de ordenação
  modoLista: boolean = false;              // Modo de exibição (lista ou grade)
  private subscription!: Subscription;     // Para gerenciar a inscrição no Observable

  constructor(
    private lojaService: LojaService,
    private router: Router // ✅ Injetado Router
  ) {}

  ngOnInit() {
    // Lógica de inicialização, se necessário
  }

  // ✅ Adicionado para corrigir erro de navegação
  irParaFavoritos() {
    this.router.navigate(['/favoritos']);
  }

  // ✅ Adicionado para corrigir erro de navegação
  irParaSacola() {
    this.router.navigate(['/sacola']);
  }

  toggleFavorito(produto: Produto) {
    produto.favorito = !produto.favorito;
    if (produto.favorito) {
      this.lojaService.adicionarFavorito(produto);
    } else {
      this.lojaService.removerFavorito(produto);
    }
  }

  isFavorito(produto: Produto): boolean {
    return this.lojaService.isFavorito(produto);
  }

  toggleSacola(produto: Produto) {
    produto.naSacola = !produto.naSacola;
    if (produto.naSacola) {
      this.lojaService.adicionarSacola(produto);
    } else {
      this.lojaService.removerSacola(produto);
    }
  }

  isNaSacola(produto: Produto): boolean {
    return this.lojaService.isNaSacola(produto);
  }

  ionViewWillEnter() {
    this.subscription = this.lojaService.sacola$.subscribe(() => {
      // Pode atualizar a interface se necessário
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
