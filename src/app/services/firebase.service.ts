import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  docData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  // Injeta a instância do Firestore corretamente
  private firestore: Firestore = inject(Firestore);

  constructor() {}

  // 🔥 Listar documentos de uma coleção
  getDocumentos(colecao: string): Observable<any[]> {
    const ref = collection(this.firestore, colecao);
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }

  // 🔥 Buscar um documento pelo ID
  getDocumentoPorId(colecao: string, id: string): Observable<any> {
    const ref = doc(this.firestore, `${colecao}/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<any>;
  }

  // 🔥 Adicionar documento
  async addDocumento(colecao: string, data: any): Promise<any> {
    try {
      const ref = collection(this.firestore, colecao);
      return await addDoc(ref, data);
    } catch (error) {
      console.error('Erro ao adicionar documento:', error);
      throw error;
    }
  }

  // 🔥 Atualizar documento
  async updateDocumento(colecao: string, id: string, data: any): Promise<void> {
    try {
      const ref = doc(this.firestore, `${colecao}/${id}`);
      await updateDoc(ref, { ...data });
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      throw error;
    }
  }

  // 🔥 Deletar documento
  async deleteDocumento(colecao: string, id: string): Promise<void> {
    try {
      const ref = doc(this.firestore, `${colecao}/${id}`);
      await deleteDoc(ref);
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      throw error;
    }
  }
}
