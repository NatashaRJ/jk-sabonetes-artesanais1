import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario: any = {
    nome: 'Não informado',
    email: 'Não informado',
    foto: ''
  };

  fotoSelecionada: File | null = null;
  fotoUrl: string = 'https://i.imgur.com/mR5mybf.png'; // Avatar padrão

  userOnline: boolean = false;
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.authService.auth.onAuthStateChanged(async (user) => {
      this.currentUser = user;
      this.userOnline = !!user;

      if (user) {
        try {
          const userDocRef = doc(this.firestore, 'usuarios', user.uid);
          const userSnap = await getDoc(userDocRef);

          const userData = userSnap.exists() ? userSnap.data() as any : {};

          this.usuario.nome =
            (userData?.nome?.toString().trim() || user.displayName?.toString().trim() || 'Não informado');

          this.usuario.email = user.email || 'Não informado';

          this.usuario.foto = userData?.foto || user.photoURL || '';

          this.fotoUrl = this.usuario.foto || 'https://i.imgur.com/mR5mybf.png';

        } catch (erro) {
          console.error('Erro ao carregar dados do usuário:', erro);
          this.usuario = {
            nome: 'Não informado',
            email: 'Não informado',
            foto: ''
          };
          this.fotoUrl = 'https://i.imgur.com/mR5mybf.png';
        }
      } else {
        this.usuario = {
          nome: 'Não informado',
          email: 'Não informado',
          foto: ''
        };
        this.fotoUrl = 'https://i.imgur.com/mR5mybf.png';
      }
    });
  }

  async onFotoSelecionada(event?: Event): Promise<void> {
    if (this.isMobile()) {
      // Mobile: usa Camera do Capacitor
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Photos // ou CameraSource.Camera para abrir direto a câmera
        });

        // image.dataUrl pode ser undefined? Pelo tipo, pode. Garantir string:
        this.fotoUrl = image.dataUrl || '';
        this.usuario.foto = this.fotoUrl;

      } catch (error) {
        console.error('Erro ao selecionar foto (mobile):', error);
      }
    } else {
      // Web: input file
      const input = event?.target as HTMLInputElement;
      const arquivo = input?.files?.[0];
      if (!arquivo) return;

      this.fotoSelecionada = arquivo;

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          this.fotoUrl = reader.result;
          this.usuario.foto = this.fotoUrl;
        }
      };

      reader.readAsDataURL(arquivo);
    }
  }

  isMobile(): boolean {
    return Capacitor.isNativePlatform();
  }

  async salvarPerfil(): Promise<void> {
    try {
      this.usuario.foto = this.fotoUrl || '';

      localStorage.setItem('usuario_logado', JSON.stringify(this.usuario));

      await this.authService.atualizarUsuario(this.usuario);

      if (this.currentUser) {
        const userDocRef = doc(this.firestore, 'usuarios', this.currentUser.uid);
        await setDoc(userDocRef, {
          nome: this.usuario.nome || 'Não informado',
          email: this.usuario.email || 'Não informado',
          foto: this.usuario.foto || '',
          tipo: 'comum'
        }, { merge: true });
      }

      alert('Perfil salvo com sucesso!');
    } catch (erro) {
      console.error('Erro ao salvar perfil:', erro);
      alert('Erro ao salvar perfil. Tente novamente.');
    }
  }

  async sair(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Sair da conta',
      message: 'Tem certeza que deseja sair?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sim, sair',
          handler: async () => {
            await this.authService.logout();
            localStorage.removeItem('usuario_logado');
            this.router.navigate(['/login']);
          }
        }
      ],
    });

    await alert.present();
  }
}
