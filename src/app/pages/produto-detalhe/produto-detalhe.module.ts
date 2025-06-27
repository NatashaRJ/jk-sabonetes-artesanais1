import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdutoDetalhePageRoutingModule } from './produto-detalhe-routing.module'; // Alterado para ProdutoDetalhePageRoutingModule

import { ProdutoDetalhePage } from './produto-detalhe.page'; // Alterado para ProdutoDetalhePage

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdutoDetalhePageRoutingModule // Alterado para ProdutoDetalhePageRoutingModule
  ],
  declarations: [ProdutoDetalhePage] // Alterado para ProdutoDetalhePage
})
export class ProdutoDetalhePageModule {} // Alterado para ProdutoDetalhePageModule
