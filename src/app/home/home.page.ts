import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  map!: L.Map;
  selectedBasemap: string = 'streets';  // Default basemap
  showCard: boolean = true;
  basemapLayer!: L.TileLayer;  // To store the active tile layer
  markers: L.Marker[] = [];  // Array to store markers

  // Array of tourist locations in Jogja
  touristLocations: { name: string, lat: number, lon: number }[] = [
    { name: 'Candi Borobudur', lat: -7.607874, lon: 110.203751 },
    { name: 'Malioboro', lat: -7.793328, lon: 110.365837 },
    { name: 'Keraton Yogyakarta', lat: -7.806654, lon: 110.364789 },
    { name: 'Taman Sari', lat: -7.810029, lon: 110.360870 },
    { name: 'Pantai Parangtritis', lat: -8.021698, lon: 110.328942 }
  ];

  // Custom icon for the markers
  customIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776000.png', // URL dari Flaticon
    iconSize: [40, 40], // Ukuran ikon [width, height]
    iconAnchor: [20, 40], // Titik jangkar ikon [x, y] (tengah bawah)
    popupAnchor: [0, -40] // Lokasi popup [x, y] relatif terhadap jangkar
  });

  constructor() {}

  ionViewDidEnter() {
    this.map = L.map('mapId').setView([-7.7956, 110.3695], 10); // Centered to Jogja

    // Add the default Streets basemap
    this.changeBasemap();

    // Add the markers to the map initially
    this.addMarkers();
  }

  // Method to change the basemap
  changeBasemap() {
    if (this.basemapLayer) {
      this.map.removeLayer(this.basemapLayer);
    }

    switch (this.selectedBasemap) {
      case 'satellite':
        // Esri World Imagery (citra satelit dari Esri)
        this.basemapLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
        });
        break;

      case 'topo':
        // Esri Topographic map
        this.basemapLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
        });
        break;

      case 'streets':
      default:
        // Default OpenStreetMap streets basemap
        this.basemapLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        break;
    }

    this.basemapLayer.addTo(this.map);
  }

  // Method to add markers for tourist locations with custom icon
  addMarkers() {
    this.touristLocations.forEach(location => {
      const marker = L.marker([location.lat, location.lon], { icon: this.customIcon })
        .bindPopup(`<b>${location.name}</b>`)
        .addTo(this.map);
      this.markers.push(marker); // Store marker in array
    });
  }

  // Method to show markers
  showMarkers() {
    this.addMarkers(); // Add the markers again if they were removed
  }

  // Method to hide markers
  hideMarkers() {
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = []; // Clear the marker array
  }

  // Method to close the card
  closeCard() {
    this.showCard = false;
  }
}
