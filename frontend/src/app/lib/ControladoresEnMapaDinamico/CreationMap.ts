import * as L from 'leaflet';
import { ParseadorDeFecha } from '../ParseadorDeFecha';

export class CreationMap {

    createMap(map): void {
  
      map = L.map('map', {
        center: [-42.785753, -65.005784],
        zoom: 13,
        maxBoundsViscosity: 1.0
      });
  
      map.setMaxBounds(L.latLngBounds(L.latLng(-89.98155760646617, -180), L.latLng(89.99346179538875, 180)));
  
      const terrainMap: L.TileLayer = L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg', {
        minZoom: 3,
        maxZoom: 17,
        attribution: 'Made with Natural Earth and QTiles'
      });
  
      const commonMap: L.TileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 3,
        maxZoom: 17,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
  
      const satellitalMap: L.TileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        minZoom: 3,
        maxZoom: 17,
        attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      });
  
      const openTopoMap: L.TileLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        minZoom: 3,
        maxZoom: 17,
        attribution: 'Map data: &copy; <a>OpenStreetMap</a> contributors, <a>SRTM</a> | Map style: &copy; <a>OpenTopoMap</a> (<a >CC-BY-SA</a>)'
      });
  
      const smoothDarkMap: L.TileLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        minZoom: 3,
        maxZoom: 17,
        attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });
  
      L.control.layers(
        {
          "Mapa oscuro": smoothDarkMap,
          "Satelital": satellitalMap,
          "Topográfico": openTopoMap,
          "Terrestre": terrainMap,
          "Open Street Map": commonMap,
        }
      ).addTo(map).setPosition("bottomright");
  
      return map;
    }

    actualizarFecha(inputSlider,labelFecha,fechasDelSlider) {
      inputSlider.max = (fechasDelSlider.length - 1) + "";
      labelFecha.innerHTML = fechasDelSlider.length > 0 ? ParseadorDeFecha.parsearValor(fechasDelSlider[inputSlider.value]) : "+- Infinito";
    }
  }