import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PuntosService } from '../services/puntos.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [FormsModule],
  providers: [PuntosService],
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements AfterViewInit {
  private map: any;
  formVisible = signal(false);
  formData = {
    lat: 0,
    lng: 0,
    fecha: new Date().toISOString().slice(0, 10),
    nombre: '',
    genero: 'masculino',
    direccion: '',
    notas: '',
    proximaVez: ''
  };

  constructor(private puntosService: PuntosService) {}

  async ngAfterViewInit(): Promise<void> {
    if (typeof window !== 'undefined') {
      const L = await import('leaflet');

      setTimeout(async () => {
        this.map = L.map('map', {
          center: [-33.795417, -61.207917],
          zoom: 16,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(this.map);

        this.map.invalidateSize();

        // 🔥 NUEVO: cargar puntos desde Firestore y mostrarlos
        const puntos = await this.puntosService.obtenerPuntos();

        puntos.forEach(p => {
          L.marker([p.lat, p.lng]).addTo(this.map)
            .bindPopup(`${p.nombre}<br>${p.direccion}`);
        });

        // evento de click en el mapa
        this.map.on('click', async (e: any) => {
          const { lat, lng } = e.latlng;
          const direccion = await this.obtenerDireccion(lat, lng);

          this.formData = {
            lat,
            lng,
            fecha: new Date().toISOString().slice(0, 10),
            nombre: '',
            genero: 'masculino',
            direccion,
            notas: '',
            proximaVez: ''
          };

          this.formVisible.set(true);
        });

      }, 0);

    }
  }

  async guardarPunto() {
    await this.puntosService.guardarPunto(this.formData);
    this.formVisible.set(false);

    const L = await import('leaflet');
    const { lat, lng } = this.formData;

    L.marker([lat, lng]).addTo(this.map)
      .bindPopup(`${this.formData.nombre}<br>${this.formData.direccion}`)
      .openPopup();
  }

  async obtenerDireccion(lat: number, lng: number): Promise<string> {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    const addr = data.address;
    const calle = addr.road || '';
    const numero = addr.house_number || '';
    return `Calle ${calle}, número ${numero}`.trim();
  }
}
