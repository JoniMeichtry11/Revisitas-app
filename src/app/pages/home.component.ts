import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements AfterViewInit {
  private map: any;

  async ngAfterViewInit(): Promise<void> {
    if (typeof window !== 'undefined') {
      const L = await import('leaflet');

      setTimeout(() => {
        this.map = L.map('map', {
          center: [-33.795417, -61.207917],
          zoom: 16,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(this.map);

        this.map.invalidateSize();

        this.map.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          L.marker([lat, lng]).addTo(this.map)
            .bindPopup(`📍 Lat: ${lat.toFixed(5)}<br>Lng: ${lng.toFixed(5)}`)
            .openPopup();
        });
      }, 0);
    }
  }
}
