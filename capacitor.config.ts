import { CapacitorConfig } from '@capacitor/cli';


const config: CapacitorConfig = {
  appId: 'com.jk.sabonetes',
  appName: 'JK Sabonetes Artesanais',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // Tempo de exibição da splash (em ms)
      launchAutoHide: true,      // Esconde automaticamente depois do carregamento
      backgroundColor: '#ffffff', // Cor do fundo
      androidSplashResourceName: 'splash',
      showSpinner: true,         // Mostra um spinner carregando (opcional)
      spinnerColor: '#c67b5b'     // Cor do spinner (pode combinar com seu logo)
    }
  }
};

export default config;
