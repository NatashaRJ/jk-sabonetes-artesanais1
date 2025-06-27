import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-avaliacoes',
  standalone: false,
  templateUrl: './avaliacoes.page.html',
  styleUrls: ['./avaliacoes.page.scss'],
})
export class AvaliacoesPage implements OnInit {

  avaliacoes = [
    { usuario: 'Ana', estrelas: 5, comentario: 'Sabonete incrível!' },
    { usuario: 'João', estrelas: 4, comentario: 'Muito cheiroso e suave.' }
  ];

  novoComentario = '';
  estrelasSelecionadas = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // 🔥 Carrega avaliações do localStorage se existirem
    const avaliacoesSalvas = localStorage.getItem('avaliacoes');
    if (avaliacoesSalvas) {
      this.avaliacoes = JSON.parse(avaliacoesSalvas);
    }

    // 🔥 Pega estrelas e comentário da rota (se vierem)
    this.route.queryParams.subscribe(params => {
      const estrelas = parseInt(params['avaliacao'], 10);
      const comentario = params['comentario'];

      if (!isNaN(estrelas)) {
        this.estrelasSelecionadas = estrelas;
      }

      if (comentario) {
        this.novoComentario = comentario;
      }
    });
  }

  enviarComentario() {
    if (this.novoComentario.trim()) {
      this.avaliacoes.push({
        usuario: 'Você',
        estrelas: this.estrelasSelecionadas,
        comentario: this.novoComentario.trim()
      });

      this.salvarAvaliacoes(); // 🔥 Salva no localStorage
      this.novoComentario = '';
      this.estrelasSelecionadas = 0;
    }
  }

  excluirComentario(index: number) {
    this.avaliacoes.splice(index, 1);
    this.salvarAvaliacoes(); // 🔥 Atualiza após excluir
  }

  selecionarEstrelas(estrelas: number) {
    this.estrelasSelecionadas = estrelas;
  }

  salvarAvaliacoes() {
    localStorage.setItem('avaliacoes', JSON.stringify(this.avaliacoes));
  }
}
