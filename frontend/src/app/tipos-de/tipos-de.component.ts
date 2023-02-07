import { Component, OnInit } from '@angular/core';

import { TipoLugar } from '../models/tipoLugar';
import { TipoZona } from '../models/tipoZona';
import { TipoTrayecto } from '../models/tipoTrayecto';
import { TipoLugarService } from '../services/tipo-lugar.service';
import { TipoZonaService } from '../services/tipo-zona.service';
import { TipoTrayectoService } from '../services/tipo-trayecto.service';
import { ResultsPage } from '../models/results-page';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../services/usuario.service';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-tipos-de',
  templateUrl: './tipos-de.component.html',
  styleUrls: ['./tipos-de.component.css']
})
export class TiposDeComponent implements OnInit {

  tiposLugar: TipoLugar[]
  tiposZona: TipoZona[]
  tiposTrayecto: TipoTrayecto[]
  pagesTiposLugar: number[]
  pagesTiposZona: number[]
  pagesTiposTrayecto: number[]
  resultsPageTiposLugar: ResultsPage = <ResultsPage>{}
  resultsPageTiposZona: ResultsPage = <ResultsPage>{}
  resultsPageTiposTrayecto: ResultsPage = <ResultsPage>{}
  currentPageTiposLugar: number = 1
  currentPageTiposZona: number = 1
  currentPageTiposTrayecto: number = 1
  size: number = 10
  currentUser: Usuario

  newEncriptado
  idTiposLugaresEncriptados = new Array()
  idTiposZonasEncriptados = new Array()
  idTiposTrayectosEncriptados = new Array()

  constructor(
    private tipoLugarService: TipoLugarService,
    private tipoZonaService: TipoZonaService,
    private tipoTrayectoService: TipoTrayectoService,
    public usuarioService: UsuarioService,
    private cryptoService: CryptoService,
  ) {
    this.usuarioService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.newEncriptado = this.cryptoService.encryptURL('new')
    this.getTiposLugar();
    this.getTiposZona();
    this.getTiposTrayecto();
  }

  getTiposLugar() {
    this.idTiposLugaresEncriptados = new Array()
    this.tipoLugarService.byPage(this.currentPageTiposLugar, this.size).subscribe((dataPackage) => {
      this.resultsPageTiposLugar = <ResultsPage>dataPackage.data;
      this.pagesTiposLugar = Array.from(Array(this.resultsPageTiposLugar.last).keys());
      for (let nombre of this.resultsPageTiposLugar.results) {
        var theTipoLugar = <TipoLugar>nombre;
        this.idTiposLugaresEncriptados.push(this.cryptoService.encryptURL('' + theTipoLugar.id))
      }
    });
  }

  getTiposZona() {
    this.idTiposZonasEncriptados = new Array()
    this.tipoZonaService.byPage(this.currentPageTiposZona, this.size).subscribe((dataPackage) => {
      this.resultsPageTiposZona = <ResultsPage>dataPackage.data;
      this.pagesTiposZona = Array.from(Array(this.resultsPageTiposZona.last).keys());
      for (let nombre of this.resultsPageTiposZona.results) {
        var theTipoZona = <TipoZona>nombre;
        this.idTiposZonasEncriptados.push(this.cryptoService.encryptURL('' + theTipoZona.id))
      }
    });
  }

  getTiposTrayecto() {
    this.idTiposTrayectosEncriptados = new Array()
    this.tipoTrayectoService.byPage(this.currentPageTiposTrayecto, this.size).subscribe((dataPackage) => {
      this.resultsPageTiposTrayecto = <ResultsPage>dataPackage.data;
      this.pagesTiposTrayecto = Array.from(Array(this.resultsPageTiposTrayecto.last).keys());
      for (let nombre of this.resultsPageTiposTrayecto.results) {
        var theTipoTrayecto = <TipoTrayecto>nombre;
        this.idTiposTrayectosEncriptados.push(this.cryptoService.encryptURL('' + theTipoTrayecto.id))
      }
    });
  }

  showPageTiposLugar(pageId: number): void {
    if (!this.currentPageTiposLugar) {
      this.currentPageTiposLugar = 1;
    }
    let page = pageId;
    if (pageId == -2) { // First
      page = 1;
    }
    if (pageId == -1) { // Previous
      page = this.currentPageTiposLugar > 1 ? this.currentPageTiposLugar - 1 : this.currentPageTiposLugar;
    }
    if (pageId == -3) { // Next
      page = this.currentPageTiposLugar < this.resultsPageTiposLugar.last ? this.currentPageTiposLugar + 1 : this.currentPageTiposLugar;
    }
    if (pageId == -4) { // Last
      page = this.resultsPageTiposLugar.last;
    }
    if (pageId > 1 && this.pagesTiposLugar.length >= pageId) { // Number
      page = this.pagesTiposLugar[pageId - 1] + 1;
    }
    this.currentPageTiposLugar = page;
    this.getTiposLugar();
  };

  showPageTiposZona(pageId: number): void {
    if (!this.currentPageTiposZona) {
      this.currentPageTiposZona = 1;
    }
    let page = pageId;
    if (pageId == -2) { // First
      page = 1;
    }
    if (pageId == -1) { // Previous
      page = this.currentPageTiposZona > 1 ? this.currentPageTiposZona - 1 : this.currentPageTiposZona;
    }
    if (pageId == -3) { // Next
      page = this.currentPageTiposZona < this.resultsPageTiposZona.last ? this.currentPageTiposZona + 1 : this.currentPageTiposZona;
    }
    if (pageId == -4) { // Last
      page = this.resultsPageTiposZona.last;
    }
    if (pageId > 1 && this.pagesTiposZona.length >= pageId) { // Number
      page = this.pagesTiposZona[pageId - 1] + 1;
    }
    this.currentPageTiposZona = page;
    this.getTiposZona();
  };

  showPageTiposTrayecto(pageId: number): void {
    if (!this.currentPageTiposTrayecto) {
      this.currentPageTiposTrayecto = 1;
    }
    let page = pageId;
    if (pageId == -2) { // First
      page = 1;
    }
    if (pageId == -1) { // Previous
      page = this.currentPageTiposTrayecto > 1 ? this.currentPageTiposTrayecto - 1 : this.currentPageTiposTrayecto;
    }
    if (pageId == -3) { // Next
      page = this.currentPageTiposTrayecto < this.resultsPageTiposTrayecto.last ? this.currentPageTiposTrayecto + 1 : this.currentPageTiposTrayecto;
    }
    if (pageId == -4) { // Last
      page = this.resultsPageTiposTrayecto.last;
    }
    if (pageId > 1 && this.pagesTiposTrayecto.length >= pageId) { // Number
      page = this.pagesTiposTrayecto[pageId - 1] + 1;
    }
    this.currentPageTiposTrayecto = page;
    this.getTiposTrayecto();
  };

  traducirMarcador(value: string): string {
    if (value == null)
      return "Default";
    if (value == "star")
      return "Estrella";
    if (value == "diamond")
      return "Diamante";
    if (value = "square")
      return "Cuadrado";
  }

  traducirColor(value: string): string {
    if (value == null)
      return "Default"
    if (value == "yellow")
      return "Amarillo"
    if (value == "blue")
      return "Azul"
    if (value == "darkblue")
      return "Azul oscuro"
    if (value == "white")
      return "Blanco"
    if (value == "lightblue")
      return "Celeste"
    if (value == "orange")
      return "Naranja"
    if (value == "black")
      return "Negro"
    if (value == "red")
      return "Rojo"
    if (value == "darkred")
      return "Rojo oscuro"
    if (value == "pink")
      return "Rosa"
    if (value == "darkpink")
      return "Rosa oscuro"
    if (value == "green")
      return "Verde"
    if (value == "lightgreen")
      return "Verde claro"
    if (value == "darkgreen")
      return "Verde oscuro"
    if (value == "violet")
      return "Violeta"
    if (value == "brown")
      return "Marrón"
    if (value == "grey")
      return "Gris"
    if (value == "gold")
      return "Dorado"
  }

  traducirIcono(value: string): string {
    if (value == null)
      return "Default"
    if (value == "airport")
      return "Aeropuerto"
    if (value == "bank")
      return "Banco"
    if (value == "home")
      return "Casa"
    if (value == "educative")
      return "Educativo"
    if (value == "gym")
      return "Gimnasio"
    if (value == "goberment")
      return "Gubernamental"
    if (value == "hospital")
      return "Hospital"
    if (value == "hotel")
      return "Hotel"
    if (value == "church")
      return "Iglesia"
    if (value == "office")
      return "Oficina"
    if (value == "shipport")
      return "Puerto maritimo"
    if (value == "rest")
      return "Residencia"
    if (value == "restaurant")
      return "Restaurante"
    if (value == "market")
      return "Supermercado"
  }

  changeSize(aSize: number){
    this.size = aSize;
    this.currentPageTiposLugar = 1
    this.currentPageTiposZona = 1
    this.currentPageTiposTrayecto = 1
    this.getTiposLugar();
    this.getTiposZona();
    this.getTiposTrayecto();
  }

}
