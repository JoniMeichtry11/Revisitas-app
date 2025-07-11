import { inject } from '@angular/core';
import { collection, addDoc, Firestore, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Punto } from '../models/Punto';

export class PuntosService {
  private firestore = inject(Firestore);

  async guardarPunto(punto: any) {
    const col = collection(this.firestore, 'puntos');
    return await addDoc(col, punto);
  }

  async obtenerPuntos(): Promise<Punto[]> {
    const colRef = collection(this.firestore, 'puntos');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Punto, 'id'>)
    }));
  }

  async actualizarPunto(id: string, data: any) {
    const docRef = doc(this.firestore, 'puntos', id);
    return await updateDoc(docRef, data);
  }

  async eliminarPunto(id: string) {
    const docRef = doc(this.firestore, 'puntos', id);
    return await deleteDoc(docRef);
  }
}
