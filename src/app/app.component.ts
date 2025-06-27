import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  mostrarSplashAngular = true;
  mostrarTexto = false;

  public appPages = [
    { title: 'Produtos', url: '/produtos', icon: 'leaf-outline' },
    { title: 'Favoritos', url: '/favoritos', icon: 'heart-half-outline' },
    { title: 'Sacola', url: '/sacola', icon: 'bag-handle-outline' },
    { title: 'Sobre', url: '/sobre', icon: 'document-text-outline' },
    { title: 'Perfil', url: '/perfil', icon: 'person-circle-outline' },
    { title: 'Login', url: '/login', icon: 'log-in-outline' },
    { title: 'Detalhes', url: '/detalhes', icon: 'information-circle-outline' },
    { title: 'Cadastro', url: '/cadastro', icon: 'person-add-outline' }
  ];

  mostrarSplash = true; // controla o splash fake

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      // Esconde splash nativo o quanto antes para evitar overlap com o fake
      try {
        await SplashScreen.hide();
      } catch (e) {
        console.warn('SplashScreen não suportado no navegador.');
      }

      // Mantém o splash fake visível por 2 segundos
      setTimeout(() => {
        this.mostrarSplash = false;

        // Redireciona se estiver na raiz ou vazio
        const currentUrl = this.router.url;
        if (currentUrl === '' || currentUrl === '/') {
          this.router.navigateByUrl('/produtos');
        }

        // Ativa o menu após splash
        this.menuCtrl.enable(true);
      }, 2000);
    });
  }

  fecharMenu() {
    this.menuCtrl.close();
  }
}
