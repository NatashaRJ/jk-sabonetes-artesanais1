import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // ✅ Importa o guard
import { NoPreloading } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder',
    pathMatch: 'full'
  },
  {
    path: 'folder',
    loadChildren: () =>
      import('./pages/folder/folder.module').then(m => m.FolderPageModule)
  },
  {
    path: 'produtos',
    loadChildren: () =>
      import('./pages/produtos/produtos.module').then(m => m.ProdutosPageModule)
  },
  {
    path: 'favoritos',
    loadChildren: () =>
      import('./pages/favoritos/favoritos.module').then(m => m.FavoritosPageModule)
  },
  {
    path: 'sacola',
    loadChildren: () =>
      import('./pages/sacola/sacola.module').then(m => m.SacolaPageModule)
  },
  {
    path: 'sobre',
    loadChildren: () =>
      import('./pages/sobre/sobre.module').then(m => m.SobrePageModule)
  },
  {
    path: 'cadastro',
    loadChildren: () =>
      import('./pages/cadastro/cadastro.module').then(m => m.CadastroPageModule)
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'central-relacionamento',
    loadChildren: () =>
      import('./pages/central-relacionamento/central-relacionamento.module').then(m => m.CentralRelacionamentoPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () =>
      import('./pages/perfil/perfil.module').then(m => m.PerfilPageModule)
  },
  {
    path: 'produto-detalhe',
    loadChildren: () =>
      import('./pages/produto-detalhe/produto-detalhe.module').then(m => m.ProdutoDetalhePageModule)
  },
  {
    path: 'avaliacoes',
    loadChildren: () =>
      import('./pages/avaliacoes/avaliacoes.module').then(m => m.AvaliacoesPageModule)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/admin/admin.module').then(m => m.AdminPageModule),
    canActivate: [AuthGuard] // ✅ Protege a rota admin
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
