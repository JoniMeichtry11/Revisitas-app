export interface Punto {
  id?: string; // opcional porque no está antes de guardar
  lat: number;
  lng: number;
  fecha: string;
  nombre: string;
  genero: string;
  direccion: string;
  notas: string;
  proximaVez: string;
}
