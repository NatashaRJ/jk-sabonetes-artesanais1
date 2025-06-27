import { Component, OnDestroy } from '@angular/core';
import { LojaService, Produto } from '../../services/loja.service';
import { Subscription } from 'rxjs';
import { ToastController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service'; // ajuste o caminho conforme seu projeto

@Component({
  selector: 'app-sacola',
  templateUrl: './sacola.page.html',
  styleUrls: ['./sacola.page.scss'],
  standalone: false,
})
export class SacolaPage implements OnDestroy {
  sacola: Produto[] = [];
  private subscription!: Subscription;

  cep: string = '';
  rua: string = '';
  bairro: string = '';
  cidade: string = '';
  uf: string = '';
  numeroCasa: string = '';
  complemento: string = '';

  frete: number = 0;
  diasEntrega: number | null = null;

  constructor(
    private lojaService: LojaService,
    private authService: AuthService, // INJETADO AuthService
    private toastController: ToastController,
    private alertController: AlertController,
    private http: HttpClient,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.subscription = this.lojaService.sacola$.subscribe(itens => {
      this.sacola = itens;
      this.calcularFrete();
    });
  }

  async verificarLogin(): Promise<boolean> {
    if (!this.authService.isLogado()) {
      const alert = await this.alertController.create({
        header: 'Atenção',
        message: 'Você precisa estar logado para realizar essa ação.',
        buttons: ['OK'],
      });
      await alert.present();
      return false;
    }
    return true;
  }

  async removerSacola(produto: Produto) {
    if (!(await this.verificarLogin())) return;

    this.lojaService.removerSacola(produto);
    this.calcularFrete();
  }

  async alterarQuantidade(produto: Produto, quantidade: number) {
    if (!(await this.verificarLogin())) return;

    const novaQuantidade = (produto.quantidade || 1) + quantidade;
    if (novaQuantidade < 1) return;
    produto.quantidade = novaQuantidade;
    this.calcularFrete();
  }

  calcularTotal(): number {
    return this.sacola.reduce((total, produto) => {
      return total + produto.valor * (produto.quantidade || 1);
    }, 0);
  }

  getFrete(): number {
    return this.frete;
  }

  getTotalGeral(): number {
    return this.calcularTotal() + this.getFrete();
  }

  async finalizarCompra() {
    if (!(await this.verificarLogin())) return;

    if (!this.cep || !this.rua || !this.bairro || !this.cidade || !this.uf || !this.numeroCasa) {
      const alertaEndereco = await this.alertController.create({
        header: 'Endereço Incompleto',
        message: 'Por favor, preencha todos os campos do endereço antes de finalizar a compra.',
        buttons: ['OK']
      });
      await alertaEndereco.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Finalizar Compra',
      message: 'Tem certeza que deseja finalizar a compra?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: async () => {
            this.lojaService.limparSacola();

            const toast = await this.toastController.create({
              message: 'Compra finalizada com sucesso! 🎉',
              duration: 2000,
              color: 'success'
            });
            await toast.present();
          }
        }
      ]
    });

    await alert.present();
  }

  buscarEndereco() {
    const cepLimpo = this.cep.replace(/\D/g, '');

    // Limpa dados antigos antes de buscar o novo endereço
    this.rua = '';
    this.bairro = '';
    this.cidade = '';
    this.uf = '';
    this.frete = 0;
    this.diasEntrega = null;

    if (cepLimpo.length === 8) {
      this.http.get<any>(`https://viacep.com.br/ws/${cepLimpo}/json/`).subscribe(
        dados => {
          if (!dados.erro) {
            this.rua = dados.logradouro;
            this.bairro = dados.bairro;
            this.cidade = dados.localidade;
            this.uf = dados.uf;
            this.calcularFrete();
          } else {
            alert('CEP não encontrado. Tente novamente com outro CEP.');
          }
        },
        erro => {
          console.error('Erro ao buscar o CEP:', erro);
          alert('Erro ao buscar o CEP. Verifique a sua conexão e tente novamente.');
        }
      );
    } else {
      alert('Digite um CEP válido com 8 números.');
    }
  }

  calcularFrete() {
    const totalProdutos = this.calcularTotal();

    if (!this.uf) {
      this.frete = 0;
      this.diasEntrega = null;
      return;
    }

    if (totalProdutos >= 50) {
      this.frete = 0;
      this.diasEntrega = 2;
      return;
    }

    const regioesSudesteSul = ['SP', 'RJ', 'MG', 'ES', 'PR', 'SC', 'RS'];

    if (regioesSudesteSul.includes(this.uf)) {
      this.frete = totalProdutos * 0.10;
      this.diasEntrega = 3;
    } else {
      this.frete = totalProdutos * 0.20;
      this.diasEntrega = 5;
    }
  }

  irParaFavoritos() {
    this.router.navigate(['/favoritos']);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
