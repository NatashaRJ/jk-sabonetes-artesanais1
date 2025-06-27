import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  produtoForm: FormGroup;
  usuarioForm: FormGroup;
  produtos: any[] = [];
  usuarios: any[] = [];
  editandoProduto: any = null;
  editandoUsuario: any = null;
  imagemSelecionada: File | null = null;
  imagemPreview: string | null = null;
  imagemURL: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.produtoForm = this.fb.group({
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      valor: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      beneficio: ['', Validators.required],
    });

    this.usuarioForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tipo: ['comum', Validators.required],
    });
  }

  ngOnInit() {
    this.carregarProdutos();
    this.carregarUsuarios();

    const produtoEditandoId = localStorage.getItem('produtoEditandoId');
    if (produtoEditandoId) {
      this.firebaseService.getDocumentoPorId('produtos', produtoEditandoId).subscribe(produto => {
        if (produto) {
          this.editarProduto(produto);
        } else {
          localStorage.removeItem('produtoEditandoId');
        }
      });
    }

    const usuarioEditandoId = localStorage.getItem('usuarioEditandoId');
    if (usuarioEditandoId) {
      this.firebaseService.getDocumentoPorId('usuarios', usuarioEditandoId).subscribe(usuario => {
        if (usuario) {
          this.editarUsuario(usuario);
        } else {
          localStorage.removeItem('usuarioEditandoId');
        }
      });
    }
  }

  carregarProdutos() {
    this.firebaseService.getDocumentos('produtos').subscribe({
      next: (produtos) => (this.produtos = produtos),
      error: (error) => console.error('Erro ao carregar produtos:', error),
    });
  }

  carregarUsuarios() {
    this.firebaseService.getDocumentos('usuarios').subscribe({
      next: (usuarios) => (this.usuarios = usuarios),
      error: (error) => console.error('Erro ao carregar usuários:', error),
    });
  }

  async fazerUploadImagem(): Promise<string | null> {
    if (!this.imagemSelecionada) return null;

    const formData = new FormData();
    formData.append('file', this.imagemSelecionada);

    try {
      const response: any = await this.http.post('http://localhost:3000/upload', formData).toPromise();

  // 🔥 Corrige aqui: pega o ID do arquivo da resposta
    const fileId = response?.fileId;

      if (fileId) {
      // 🔥 Gera o link para exibir a imagem
      const url = `https://drive.google.com/uc?export=view&id=${fileId}`;
      return url;
    } else {
        console.error('Resposta do upload sem URL válida:', response);
        return null;
      }
    } catch (error) {
      console.error('Erro no upload da imagem:', error);
      return null;
    }
  }

  async salvarProduto() {
    if (this.produtoForm.invalid) return;

    const produtoData = { ...this.produtoForm.value };

    try {
      if (this.imagemSelecionada) {
        const url = await this.fazerUploadImagem();
        produtoData.imagem = url ? url : '';
      } else if (this.editandoProduto) {
        produtoData.imagem = this.editandoProduto.imagem || '';
      } else {
        produtoData.imagem = '';
      }

      if (this.editandoProduto) {
        await this.firebaseService.updateDocumento('produtos', this.editandoProduto.id, produtoData);
      } else {
        await this.firebaseService.addDocumento('produtos', produtoData);
      }

      this.resetarProduto();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  }

  editarProduto(produto: any) {
    this.editandoProduto = produto;
    this.produtoForm.patchValue(produto);
    this.imagemSelecionada = null;
    this.imagemPreview = produto.imagem ?? null;
    localStorage.setItem('produtoEditandoId', produto.id);
  }

  async excluirProduto(produto: any) {
    try {
      await this.firebaseService.deleteDocumento('produtos', produto.id);
      if (this.editandoProduto?.id === produto.id) {
        this.resetarProduto();
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  }

  uploadImagem(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.imagemSelecionada = target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagemPreview = reader.result as string;
      };
      reader.readAsDataURL(this.imagemSelecionada);
    }
  }

  resetarProduto() {
    this.produtoForm.reset();
    this.editandoProduto = null;
    this.imagemSelecionada = null;
    this.imagemPreview = null;
    localStorage.removeItem('produtoEditandoId');
    this.carregarProdutos();
  }

  async salvarUsuario() {
    if (this.usuarioForm.invalid) return;

    const usuarioData = { ...this.usuarioForm.value };

    try {
      if (this.editandoUsuario) {
        await this.firebaseService.updateDocumento('usuarios', this.editandoUsuario.id, usuarioData);
      } else {
        await this.firebaseService.addDocumento('usuarios', usuarioData);
      }

      this.resetarUsuario();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  }

  editarUsuario(usuario: any) {
    this.editandoUsuario = usuario;
    this.usuarioForm.patchValue({
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo || 'comum',
    });
    localStorage.setItem('usuarioEditandoId', usuario.id);
  }

  async excluirUsuario(usuario: any) {
    try {
      await this.firebaseService.deleteDocumento('usuarios', usuario.id);
      if (this.editandoUsuario?.id === usuario.id) {
        this.resetarUsuario();
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  }

  resetarUsuario() {
    this.usuarioForm.reset();
    this.editandoUsuario = null;
    localStorage.removeItem('usuarioEditandoId');
    this.carregarUsuarios();
  }

onImageError(event: any) {
  event.target.src = '../../../assets/sem.imagem.png';
}



  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
