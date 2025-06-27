import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProdutosPageRoutingModule } from './produtos-routing.module';
import { ProdutosPage } from './produtos.page';

// ✅ Importa seu pipe
import { OrdenarPorPipe } from 'src/app/pipes/ordenar-por.pipe';

@NgModule({
  declarations: [
    ProdutosPage,
    OrdenarPorPipe // ✅ Pipe declarado aqui
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdutosPageRoutingModule
  ]
})
export class ProdutosPageModule {}
