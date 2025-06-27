import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CentralRelacionamentoPageRoutingModule } from './central-relacionamento-routing.module';
import { CentralRelacionamentoPage } from './central-relacionamento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CentralRelacionamentoPageRoutingModule
  ],
  declarations: [CentralRelacionamentoPage]
})
export class CentralRelacionamentoPageModule {}
