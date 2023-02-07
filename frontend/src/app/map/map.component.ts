import { Component, AfterViewInit, ComponentFactoryResolver, OnInit } from '@angular/core';
import * as L from 'leaflet';

import { LugarService } from '../services/lugar.service';
import { ZonaService } from '../services/zona.service';
import { Lugar } from '../models/lugar';
import { Zona } from '../models/zona';
import { Pertenece } from '../models/pertenece';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { TrayectoService } from '../services/trayecto.service';
import { Trayecto } from '../models/trayecto';
import { TipoLugar } from '../models/tipoLugar';
const provider = new OpenStreetMapProvider();
const searchControl =  GeoSearchControl({
  provider: provider,
});

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  map;
  lugares: Lugar[];
  zonas: Zona[];
  trayectos: Trayecto[];
  pertenece: Pertenece[];
  lugar: Lugar
  tipoLugar:TipoLugar
  colorIcono: string;

  tamañoMarcador: L.PointExpression;
  tamañoSombra: L.PointExpression;
  icono: string;


  greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  tipoMarcador: string;


  constructor(
    private lugarService: LugarService,
    private zonaService: ZonaService,
    private trayectoService: TrayectoService,
  ) { }

  ngAfterViewInit(): void {
    // this.getPertenece();
    this.createMap();
    this.getLugares();
    this.getZonas();
    this.getTrayectos();
  }

  createMap(): void {
    const parcThabor = {
      lat: -42.785753,
      lng: -65.005784,
    };

    const zoomLevel = 13;

    this.map = L.map('map', {
      center: [parcThabor.lat, parcThabor.lng],
      zoom: zoomLevel,
      maxBoundsViscosity: 1.0
    });

    const southWest = L.latLng(-89.98155760646617, -180);
    const northEast = L.latLng(89.99346179538875, 180);
    const bounds = L.latLngBounds(southWest, northEast);

    const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 3,
      maxZoom: 17,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    this.map.setMaxBounds(bounds);

    mainLayer.addTo(this.map);

  }

  // private getPertenece(): void {
  //   this.lugarService.getPertenece().subscribe((dataPackage) => {
  //     this.pertenece = (dataPackage.data as Pertenece[]);
  //   });
  // }

  getLugares(): void {
    this.lugarService.getLugares().subscribe((dataPackage) => {
      this.lugares = (dataPackage.data as Lugar[]);
      for (const lugar of this.lugares) {
        // Cambia el icono dependiendo si se encuentra dentro de una zona.
        let icon = this.redIcon;
        // if (this.pertenece){
        //   this.pertenece.forEach(per => {
        //     if (per.id === lugar.id && per.pertenece) {
        //       icon = this.greenIcon;
        //     }
        //   });
        // }
        this.tipoLugar = lugar.tipos_lugare;

        // Aqui se definen los atributos del Icono, según el TipoLugar

        if (this.tipoLugar.tipo_marcador != null) {
          this.tipoMarcador = "-" + this.tipoLugar.tipo_marcador;
        } else {
          this.tipoMarcador = "";
        }

        if(this.tipoLugar.icono != null) {
          this.icono = "-" + this.tipoLugar.icono;
        } else {
          this.icono = "";
        }

        if (this.tipoLugar.color != null) {
          this.colorIcono = this.tipoLugar.color;
        } else {
          this.colorIcono = 'red';
        }

        if (this.tipoLugar.size != null) {
          this.tamañoMarcador = [(this.tipoLugar.size + (this.tipoLugar.size / 4)), this.tipoLugar.size * 2];
          this.tamañoSombra = [this.tipoLugar.size *2, this.tipoLugar.size *2]
        } else {
          this.tamañoMarcador = [25, 40];
          this.tamañoSombra = [40, 40];
        }

        var icono1 = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/gustavonunezlab/icons/main/' + this.colorIcono + this.tipoMarcador + this.icono + '-matte.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: this.tamañoMarcador,
          shadowSize: this.tamañoSombra,
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        });

        // Fin atributos Icono

        const marcador = L.marker(lugar.punto.coordinates,  { icon: icono1 })
          .bindPopup(
            '<h2>' +
            lugar.lugar +
            '</h2><p>Informacion acerca del marcador: </p><ul><li>Descripcion: ' +
            (lugar.descripcion ? lugar.descripcion :"")
            + '</li><li>Coordenadas: [' +
            lugar.punto.coordinates[0] + ', ' + lugar.punto.coordinates[1] +
            ']</li></ul>'
          )
          .addTo(this.map);
      }
    });
  }


  getZonas(): void {
    this.zonaService.getZonas().subscribe((dataPackage) => {

      this.zonas = (dataPackage.data as Zona[]);
      for (const zona of this.zonas) {
        // tslint:disable-next-line:max-line-length
        var polygon = L.polygon(zona.poligono.coordinates, { dashArray: zona.tipos_zona.tipo_linea,color: zona.tipos_zona.color,weight:2,fillColor:zona.tipos_zona.color_relleno,fillOpacity:0.1}).bindPopup(
          '<h2>' + zona.zona +
          '</h2><p>Informacion acerca del marcador: </p><ul><li>Tipo zona: '
          + zona.tipos_zona.tipo_zona
          +'</li></ul>')
          .addTo(this.map);

      }

    });
  }

  getTrayectos(): void{
    this.trayectoService.getTrayectos().subscribe((dataPackage) => {

      this.trayectos = (dataPackage.data as Trayecto[]);
      for (const trayecto of this.trayectos) {
        // tslint:disable-next-line:max-line-length
        var linestring = L.polyline(trayecto.curva.coordinates,  {color: trayecto.tipos_trayecto.color, dashArray: trayecto.tipos_trayecto.tipo_linea, weight: trayecto.tipos_trayecto.linea }).bindPopup(
          '<h2>' + trayecto.trayecto +
          '</h2><p>Informacion acerca del marcador: </p><ul><li>Tipo Trayecto: '
          + trayecto.tipos_trayecto.tipo_trayecto
          +'</li></ul>')
          .addTo(this.map);
        }
    });

  }

}
