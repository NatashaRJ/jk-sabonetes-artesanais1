import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LojaService } from '../../services/loja.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produto-detalhe',
  standalone: false,
  templateUrl: './produto-detalhe.page.html',
  styleUrls: ['./produto-detalhe.page.scss'],
})
export class ProdutoDetalhePage implements AfterViewInit {
  produto: any;
  quantidade = 1;
  favorito = false;
  quantidadeNaSacola = 0;
  avaliacaoSelecionada = 0;
  novoComentario = '';

  showQuantity = false;  // ✅ Adicionado para controlar exibição do bloco de quantidade

@ViewChild('bottom', { static: false }) bottom!: ElementRef;  // ✅ Correção TS2564

  constructor(
    private route: ActivatedRoute,
    private toastController: ToastController,
    private lojaService: LojaService,
    private router: Router
  ) {
    // Captura os parâmetros passados via queryParams e atribui ao objeto produto
    this.route.queryParams.subscribe(params => {
      this.produto = {
        nome: params['nome'],
        categoria: params['categoria'],
        valor: Number(params['valor']),
        imagem: params['imagem']
      };

      // Verifica se o produto está na lista de favoritos
      this.favorito = this.lojaService.isFavoritoPorNome(this.produto.nome);

      // Verifica a quantidade de produtos na sacola
      const produtoNaSacola = this.lojaService.getProdutosNaSacola().find(p => p.nome === this.produto.nome);
      if (produtoNaSacola) {
        this.quantidadeNaSacola = produtoNaSacola.quantidade ?? 0;
      }
    });
  }

  ngAfterViewInit() {  
    // ✅ Observa se o fundo da página entrou na tela
    const observer = new IntersectionObserver(([entry]) => {
      this.showQuantity = entry.isIntersecting;
    }, { threshold: 0.1 });

    observer.observe(this.bottom.nativeElement);
  }

  aumentar() {
    this.quantidade++;
  }

  diminuir() {
    if (this.quantidade > 1) {
      this.quantidade--;
    }
  }

  favoritar() {
    if (this.favorito) {
      this.lojaService.removerFavoritoPorNome(this.produto.nome);
    } else {
      this.lojaService.adicionarFavorito(this.produto);
    }
    this.favorito = !this.favorito;
  }

  async adicionarSacola() {
    this.lojaService.adicionarSacola(this.produto, this.quantidade);
    const produtoNaSacola = this.lojaService.getProdutosNaSacola().find(p => p.nome === this.produto.nome);
    if (produtoNaSacola) {
      this.quantidadeNaSacola = produtoNaSacola.quantidade ?? 0;
    }

    const toast = await this.toastController.create({
      message: `${this.quantidade} produto(s) adicionado(s) à sacola.`,
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  }

  async removerDaSacola() {
    this.lojaService.removerSacola(this.produto);
    this.quantidadeNaSacola = 0;

    const toast = await this.toastController.create({
      message: 'Produto removido da sacola.',
      duration: 2000,
      color: 'danger'
    });
    await toast.present();
  }

  irParaFavoritos() {
    this.router.navigate(['/favoritos']);
  }

  irParaSacola() {
    this.router.navigate(['/sacola']);
  }

  irParaAvaliacoes() {
    this.router.navigate(['/avaliacoes'], { 
      queryParams: { 
        produto: this.produto.nome, 
        avaliacao: this.avaliacaoSelecionada, 
        comentario: this.novoComentario 
      } 
    });
  }

  async compartilhar() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: this.produto.nome,
          text: `Confira esse produto incrível: ${this.produto.nome}`,
          url: window.location.href
        });
        console.log("Produto compartilhado com sucesso!");
      } catch (error) {
        console.error("Erro ao compartilhar o produto", error);
      }
    } else {
      const toast = await this.toastController.create({
        message: 'Compartilhamento não suportado neste dispositivo.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
    }
  }

  selecionarEstrelas(qtd: number) {
    this.avaliacaoSelecionada = qtd;
    console.log(`Usuário selecionou ${qtd} estrela(s)`);
  }
}
