import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CentralRelacionamentoPage } from './central-relacionamento.page';

const routes: Routes = [
  {
    path: '',
    component: CentralRelacionamentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentralRelacionamentoPageRoutingModule {}
