import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-central-relacionamento',
  standalone: false,
  templateUrl: './central-relacionamento.page.html',
  styleUrls: ['./central-relacionamento.page.scss'],
})
export class CentralRelacionamentoPage {
  nome: string = '';
  email: string = '';
  mensagem: string = '';

  constructor(private toastController: ToastController) {}

  // Método chamado ao enviar o formulário
  async enviarFormulario() {
    // Verifica se todos os campos do formulário foram preenchidos
    if (this.nome && this.email && this.mensagem) {
      // Exibe um toast de sucesso
      const toast = await this.toastController.create({
        message: 'Mensagem enviada com sucesso!',
        duration: 2000,
        color: 'success',
      });
      await toast.present();

      // Aqui você pode adicionar lógica para enviar os dados para o servidor ou serviço de e-mail
      this.limparFormulario();
    } else {
      // Exibe um toast de erro se os campos não foram preenchidos
      const toast = await this.toastController.create({
        message: 'Por favor, preencha todos os campos.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }

  // Método para limpar o formulário após o envio
  limparFormulario() {
    this.nome = '';
    this.email = '';
    this.mensagem = '';
  }
}
