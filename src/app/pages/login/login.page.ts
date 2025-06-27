import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  User
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  setDoc
} from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email: string = '';
  password: string = '';
  nome: string = '';
  isCreatingAccount: boolean = false;
  mostrarSenha: boolean = false;
  lembrar: boolean = false;
  
  currentUser: User | null = null;
  isAdmin: boolean = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore
  ) {
    this.auth.onAuthStateChanged(async user => {
      if (user) {
        this.currentUser = user;
        this.isAdmin = await this.verificarTipoUsuario(user.uid);
      } else {
        this.currentUser = null;
        this.isAdmin = false;
      }
    });
  }

  // 🔥 LOGIN
  async login() {
    try {
      const cred = await signInWithEmailAndPassword(
        this.auth,
        this.email.trim().toLowerCase(),
        this.password
      );
      this.currentUser = cred.user;

      const tipo = await this.buscarTipoUsuario(cred.user.uid);
      this.isAdmin = tipo === 'master';

      const usuario = {
        uid: cred.user.uid,
        email: cred.user.email,
        nome: cred.user.displayName || 'Não informado',
        foto: cred.user.photoURL || '',
        tipo,
        favoritos: [],
        sacola: []
      };

      const docRef = doc(this.firestore, 'usuarios', cred.user.uid);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        await setDoc(docRef, {
          email: cred.user.email,
          nome: 'Não informado',
          tipo: 'comum'
        });
      }

      if (this.lembrar) {
        localStorage.setItem('usuario_logado', JSON.stringify(usuario));
      }

      this.router.navigateByUrl(this.isAdmin ? '/admin' : '/produtos');
    } catch (error) {
      alert('Erro no login: ' + (error as any).message);
    }
  }

  // 🔥 REGISTER COM REGRA ADMIN
  async register() {
    try {
      const emailLimpo = this.email.trim().toLowerCase();
      const nomeLimpo = this.nome.trim().toLowerCase();

      const tipo = nomeLimpo === 'admin' ? 'master' : 'comum';

      const cred = await createUserWithEmailAndPassword(
        this.auth,
        emailLimpo,
        this.password
      );

      const docRef = doc(this.firestore, 'usuarios', cred.user.uid);
      await setDoc(docRef, {
        email: emailLimpo,
        nome: this.nome.trim(),
        tipo: tipo
      });

      alert('Usuário cadastrado com sucesso!');
      this.isCreatingAccount = false;
      this.email = '';
      this.password = '';
      this.nome = '';
    } catch (error) {
      alert('Erro ao criar usuário: ' + (error as any).message);
    }
  }

  toggleForm() {
    this.isCreatingAccount = !this.isCreatingAccount;
  }

  // 🔥 ESQUECI SENHA COM TRATAMENTO MELHOR
async esqueciSenha() {
  if (!this.email) {
    alert('Informe seu e-mail para redefinir a senha.');
    return;
  }

  const emailFormatado = this.email.trim().toLowerCase();

  try {
    await sendPasswordResetEmail(this.auth, emailFormatado);
    alert('Um e-mail de redefinição foi enviado para ' + emailFormatado);
  } catch (error: any) {
    console.log(error);
    switch (error.code) {
      case 'auth/invalid-email':
        alert('O e-mail digitado é inválido.');
        break;
      case 'auth/user-not-found':
        alert('Nenhuma conta encontrada com este e-mail.');
        break;
      default:
        alert('Erro ao enviar e-mail: ' + error.message);
        break;
    }
  }
}


  // 🔥 BUSCAR TIPO DO USUÁRIO
  private async buscarTipoUsuario(uid: string): Promise<string> {
    const docRef = doc(this.firestore, 'usuarios', uid);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as any).tipo || 'comum' : 'comum';
  }

  private async verificarTipoUsuario(uid: string): Promise<boolean> {
    const tipo = await this.buscarTipoUsuario(uid);
    return tipo === 'master';
  }
}
