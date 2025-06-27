import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LojaService, Produto } from '../../services/loja.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-folder',
  standalone: false,
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder!: string;
  public filtro: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private lojaService: LojaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  adicionarSacola(produto: any) {
    this.lojaService.adicionarSacola(produto);
  }

  removerSacola(produto: any) {
    this.lojaService.removerSacola(produto);
  }

  adicionarFavorito(produto: any) {
    this.lojaService.adicionarFavorito(produto);
  }

  removerFavorito(produto: any) {
    this.lojaService.removerFavoritoPorNome(produto.nome);
  }

  isFavorito(produto: any): boolean {
    return this.lojaService.isFavoritoPorNome(produto.nome);
  }

  isNaSacola(produto: any): boolean {
    return this.lojaService.isNaSacola(produto);
  }

  irParaFavoritos() {
    this.router.navigate(['/favoritos']);
  }

  irParaSacola() {
    this.router.navigate(['/sacola']);
  }

  // ===================== NOVOS MÉTODOS POR NOME =====================

  toggleFavoritoPorNome(nome: string): void {
    if (this.isFavoritoPorNome(nome)) {
      this.removerFavoritoPorNome(nome);
    } else {
      this.adicionarFavoritoPorNome(nome);
    }
  }

  isFavoritoPorNome(nome: string): boolean {
    return this.lojaService.isFavoritoPorNome(nome);
  }

  removerFavoritoPorNome(nome: string): void {
    this.lojaService.removerFavoritoPorNome(nome);
  }

  adicionarFavoritoPorNome(nome: string): void {
    const produto: Produto = {
      nome,
      categoria: '',
      valor: 0,
      imagem: '',
      favorito: true
    };
    this.lojaService.adicionarFavorito(produto);
  }
}
