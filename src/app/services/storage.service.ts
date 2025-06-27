import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // 🔥 Verifique se o backend está rodando nesse endereço
  private baseUrl = 'http://localhost:3000'; 
  // ⚠️ Se for testar no celular, troque para seu IP local, exemplo:
  // private baseUrl = 'http://192.168.0.10:3000';

  constructor(private http: HttpClient) {}

  // ✅ Upload de imagem
  uploadImagem(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ url: string }>(
      `${this.baseUrl}/upload`,
      formData
    );
  }
}
