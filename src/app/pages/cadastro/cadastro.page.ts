import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: false,
})
export class CadastroPage {
  cadastroForm: FormGroup;
  mensagem = '';
  corMensagem: 'success' | 'danger' = 'success';

  mostrarSenha = false;
  mostrarConfirmarSenha = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
    });
  }

  async cadastrar() {
    if (this.cadastroForm.invalid) {
      this.setMensagem('Preencha todos os campos corretamente.', 'danger');
      return;
    }

    const { nome, email, senha, confirmarSenha } = this.cadastroForm.value;

    if (senha !== confirmarSenha) {
      this.setMensagem('As senhas não coincidem!', 'danger');
      return;
    }

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    // 🔥 Definir tipo: master se nome for 'admin', caso contrário 'comum'
    const tipo = nomeLimpo.trim().toLowerCase() === 'admin' ? 'master' : 'comum';

    try {
      const cred = await createUserWithEmailAndPassword(this.auth, emailLimpo, senha);
      const uid = cred.user.uid;

      await setDoc(doc(this.firestore, 'usuarios', uid), {
        nome: nomeLimpo,
        email: emailLimpo,
        tipo: tipo,  // ✅ Tipo ajustado dinamicamente
      });

      this.setMensagem(`Usuário ${nomeLimpo} cadastrado com sucesso!`, 'success');
      this.cadastroForm.reset();
      await this.router.navigate(['/login']);
    } catch (erro: any) {
      const mensagens: Record<string, string> = {
        'auth/email-already-in-use': 'E-mail já cadastrado.',
        'auth/invalid-email': 'E-mail inválido.',
        'auth/weak-password': 'Senha fraca. Use ao menos 6 caracteres.',
      };

      this.setMensagem(mensagens[erro.code] || 'Erro ao cadastrar usuário.', 'danger');
      console.error('Erro no cadastro:', erro);
    }
  }

  toggleSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  toggleConfirmarSenha() {
    this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
  }

  private setMensagem(msg: string, cor: 'success' | 'danger') {
    this.mensagem = msg;
    this.corMensagem = cor;
  }
}
