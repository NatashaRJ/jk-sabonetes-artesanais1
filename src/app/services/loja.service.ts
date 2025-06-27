import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service'; // ✅ Import do AuthService

export interface Produto {
  nome: string;
  categoria: string;
  valor: number;
  imagem?: string;
  favorito?: boolean;
  naSacola?: boolean;
  quantidade?: number;
  dataAdicao?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class LojaService {
  constructor(private authService: AuthService) {} // ✅ Injeção do AuthService

  // ===================== SACOLA =====================
  private sacolaSubject = new BehaviorSubject<Produto[]>(this.carregarSacola());
  sacola$ = this.sacolaSubject.asObservable();

  private carregarSacola(): Produto[] {
    const dados = JSON.parse(localStorage.getItem('sacola') || '[]');
    return dados.map((produto: any) => ({
      ...produto,
      dataAdicao: produto.dataAdicao ? new Date(produto.dataAdicao) : undefined,
    }));
  }

  adicionarSacola(produto: Produto, quantidade: number = 1) {
    if (!this.authService.isLogado()) {
      alert('Você precisa estar logado para adicionar à sacola.');
      return;
    }

    const atual = this.sacolaSubject.value;
    const existente = atual.find((p) => p.nome === produto.nome);

    if (existente) {
      existente.quantidade = (existente.quantidade || 1) + quantidade;
    } else {
      const novoProduto = { ...produto, naSacola: true, quantidade };
      atual.push(novoProduto);
    }

    this.sacolaSubject.next([...atual]);
    localStorage.setItem('sacola', JSON.stringify(atual));
  }

  removerSacola(produto: Produto) {
    const novaLista = this.sacolaSubject.value.filter((p) => p.nome !== produto.nome);
    produto.naSacola = false;
    this.sacolaSubject.next(novaLista);
    localStorage.setItem('sacola', JSON.stringify(novaLista));
  }

  limparSacola() {
    this.sacolaSubject.next([]);
    localStorage.removeItem('sacola');
  }

  isNaSacola(produto: Produto): boolean {
    return this.sacolaSubject.value.some((p) => p.nome === produto.nome);
  }

  getProdutosNaSacola(): Produto[] {
    return this.sacolaSubject.value;
  }

  // ===================== FAVORITOS =====================
  private favoritosSubject = new BehaviorSubject<Produto[]>(this.carregarFavoritos());
  favoritos$ = this.favoritosSubject.asObservable();

  private carregarFavoritos(): Produto[] {
    const dados = JSON.parse(localStorage.getItem('favoritos') || '[]');
    return dados.map((produto: any) => ({
      ...produto,
      dataAdicao: produto.dataAdicao ? new Date(produto.dataAdicao) : undefined,
    }));
  }

  adicionarFavorito(produto: Produto) {
    if (!this.authService.isLogado()) {
      alert('Você precisa estar logado para adicionar aos favoritos.');
      return;
    }

    const atual = this.favoritosSubject.value;
    if (!atual.some((p) => p.nome === produto.nome)) {
      produto.favorito = true;
      produto.dataAdicao = new Date();
      const novaLista = [...atual, produto];
      this.favoritosSubject.next(novaLista);
      localStorage.setItem('favoritos', JSON.stringify(novaLista));
    }
  }

  removerFavoritoPorNome(nome: string): void {
    const novaLista = this.favoritosSubject.value.filter((p) => p.nome !== nome);
    this.favoritosSubject.next(novaLista);
    localStorage.setItem('favoritos', JSON.stringify(novaLista));
  }

  removerFavorito(produto: Produto): void {
    this.removerFavoritoPorNome(produto.nome);
  }

  isFavoritoPorNome(nome: string): boolean {
    return this.favoritosSubject.value.some((p) => p.nome === nome);
  }

  isFavorito(produto: Produto): boolean {
    return this.isFavoritoPorNome(produto.nome);
  }

  ordenarFavoritosPorData() {
    const listaOrdenada = [...this.favoritosSubject.value].sort((a, b) => {
      const dataA = a.dataAdicao instanceof Date ? a.dataAdicao : new Date(a.dataAdicao!);
      const dataB = b.dataAdicao instanceof Date ? b.dataAdicao : new Date(b.dataAdicao!);
      return dataA.getTime() - dataB.getTime();
    });
    this.favoritosSubject.next(listaOrdenada);
  }
}
