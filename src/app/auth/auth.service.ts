import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  User,
  onAuthStateChanged,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USER_KEY = 'usuario_logado';

  auth: Auth = inject(Auth);
  firestore: Firestore = inject(Firestore);

  constructor() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        await this.processarUsuario(user);
      }
    });
  }

  private async processarUsuario(user: User) {
    try {
      const docRef = doc(this.firestore, 'usuarios', user.uid);
      const snap = await getDoc(docRef);

      let tipo = 'comum';
      let nome = user.displayName || 'Não informado';

      if (!snap.exists()) {
        await setDoc(docRef, {
          email: user.email || '',
          nome: nome,
          tipo: tipo,
        });
      } else {
        const dados = snap.data() as any;
        tipo = dados?.tipo || 'comum';
        nome = dados?.nome || nome;
      }

      const usuario = {
        uid: user.uid,
        email: user.email || '',
        tipo,
        nome,
        favoritos: [],
        sacola: [],
      };

      this.salvarUsuario(usuario);
    } catch (erro) {
      console.error('Erro ao buscar dados do usuário:', erro);
    }
  }

  salvarUsuario(usuario: any): void {
    usuario.favoritos ??= [];
    usuario.sacola ??= [];
    usuario.tipo ??= 'comum';
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
  }

  async atualizarUsuario(usuario: any): Promise<void> {
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));

    const user = this.auth.currentUser;
    if (user) {
      const docRef = doc(this.firestore, 'usuarios', user.uid);
      try {
        await updateDoc(docRef, {
          nome: usuario.nome || '',
          email: usuario.email,
          tipo: usuario.tipo || 'comum',
        });
      } catch (erro) {
        console.error('Erro ao atualizar usuário no Firestore:', erro);
      }
    }
  }

  getUsuario(): any {
    const data = localStorage.getItem(this.USER_KEY);
    if (!data) return null;

    const usuario = JSON.parse(data);
    usuario.favoritos ??= [];
    usuario.sacola ??= [];
    usuario.tipo ??= 'comum';

    return usuario;
  }

  // ✅ Função solicitada adicionada aqui
  getUsuarioLogado() {
    const user = localStorage.getItem('usuario_logado');
    return user ? JSON.parse(user) : null;
  }

  getUsuarioAtual(): any {
    return this.getUsuario();
  }

  isLogado(): boolean {
    return this.getUsuario() !== null;
  }

  async logout(): Promise<void> {
    localStorage.removeItem(this.USER_KEY);
    try {
      await signOut(this.auth);
    } catch (erro) {
      console.error('Erro ao deslogar:', erro);
    }
  }

  async adicionarFavorito(produto: any): Promise<void> {
    const usuario = this.getUsuario();
    if (!usuario) return;

    usuario.favoritos.push(produto);
    await this.atualizarUsuario(usuario);
  }

  async adicionarSacola(produto: any): Promise<void> {
    const usuario = this.getUsuario();
    if (!usuario) return;

    usuario.sacola.push(produto);
    await this.atualizarUsuario(usuario);
  }

  getFavoritos(): any[] {
    return this.getUsuario()?.favoritos || [];
  }

  getSacola(): any[] {
    return this.getUsuario()?.sacola || [];
  }

  async cadastrarUsuario(
    email: string,
    senha: string,
    tipo: 'master' | 'comum'
  ): Promise<void> {
    const cred = await createUserWithEmailAndPassword(
      this.auth,
      email,
      senha
    );

    const uid = cred.user.uid;
    const nome = cred.user.displayName || 'Não informado';

    const userRef = doc(this.firestore, 'usuarios', uid);
    await setDoc(userRef, {
      email,
      tipo,
      nome,
    });

    const usuario = {
      uid,
      email,
      tipo,
      nome,
      favoritos: [],
      sacola: [],
    };

    this.salvarUsuario(usuario);
  }

  async loginFirebase(email: string, senha: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(this.auth, email, senha);

    const docRef = doc(this.firestore, 'usuarios', cred.user.uid);
    const snap = await getDoc(docRef);
    const dados = snap.exists() ? (snap.data() as any) : {};

    const usuario = {
      uid: cred.user.uid,
      email: cred.user.email || '',
      tipo: dados?.tipo || 'comum',
      nome: dados?.nome || cred.user.displayName || 'Não informado',
      favoritos: [],
      sacola: [],
    };

    this.salvarUsuario(usuario);
    return cred.user;
  }

  async getTipoUsuario(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (!user) return null;

    const docRef = doc(this.firestore, 'usuarios', user.uid);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as any).tipo : null;
  }

  async loginComGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(this.auth, provider);
  }

  async finalizarLoginGoogle(): Promise<void> {
    const result = await getRedirectResult(this.auth);
    const user = result?.user;
    if (!user) return;

    await this.processarUsuario(user);
  }

  login(email: string, senha: string): boolean {
    if (email === 'teste@teste.com' && senha === '123456') {
      const usuario = {
        uid: 'teste123',
        email,
        tipo: 'comum',
        nome: 'Usuário Teste',
        favoritos: [],
        sacola: [],
      };
      this.salvarUsuario(usuario);
      return true;
    }
    return false;
  }
}
