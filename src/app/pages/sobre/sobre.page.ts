import { Component } from '@angular/core';

@Component({
  selector: 'app-sobre',
  standalone: false,
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
})
export class SobrePage {
  public missao: string = 'Oferecer produtos de cuidado pessoal que tragam bem-estar, utilizando apenas ingredientes naturais e de qualidade.';
  public visao: string = 'Ser referência em sabonetes artesanais, promovendo saúde, beleza e responsabilidade ambiental.';

  enviarEmail() {
     window.location.href = 'mailto:jkbelezanatural@gmail.com';
  }
}
