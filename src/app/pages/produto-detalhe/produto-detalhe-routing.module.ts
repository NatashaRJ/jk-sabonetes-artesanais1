import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProdutoDetalhePage } from './produto-detalhe.page'; // Alterado para ProdutoDetalhePage

const routes: Routes = [
  {
    path: '',
    component: ProdutoDetalhePage // Alterado para ProdutoDetalhePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdutoDetalhePageRoutingModule {} // Nome da classe também pode ser ajustado, se necessário
