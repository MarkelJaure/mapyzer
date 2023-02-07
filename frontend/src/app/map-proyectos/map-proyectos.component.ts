import { Router } from "@angular/router";
import { Component, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ProyectoService } from '../services/proyecto.service';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { VisualizadorProyectoEnMapa } from "../lib/ControladoresEnMapaDinamico/VisualizadorProyectoEnMapa";
import { CreationMap } from "../lib/ControladoresEnMapaDinamico/CreationMap";
import { ArreglosController } from "../lib/ArreglosController";

import { Proyecto } from '../models/proyecto';
import { NRO_LUGAR, NRO_TRAYECTO, NRO_ZONA } from "../lib/data.config";

@Component({
  selector: 'app-map-proyectos',
  templateUrl: './map-proyectos.component.html',
  styleUrls: ['./map-proyectos.component.css'],
  providers: [NgbDropdownConfig]
})
export class MapProyectosComponent implements AfterViewInit {

  idProyectos: number[]
  map;
  seleccionando: boolean = true
  fechasDelSlider = new Array();

  private labelFecha = document.getElementById("labelFecha");
  inputSlider = <HTMLInputElement>document.getElementById("inputSlider");
  checkVerEnElTiempo = <HTMLInputElement>document.getElementById("checkVerEnElTiempo");

  playing = false
  selectedSpeed = "Velocidad"

  creationMap = new CreationMap;
  visualizadoresProyectosEnMapa = new Array() as Array<VisualizadorProyectoEnMapa>;

  readonly NRO_LUGAR = NRO_LUGAR
  readonly NRO_ZONA = NRO_ZONA
  readonly NRO_TRAYECTO = NRO_TRAYECTO


  //TODO: verificar siguientes variables
  tiposLugares = new Array();
  tiposZonas = new Array();
  tiposTrayectos = new Array();

  constructor(
    private readonly proyectoService: ProyectoService,
    private readonly location: Location,
    private readonly router: Router,
  ) {
    this.idProyectos = this.proyectoService.proyectosAVisualizar

    if (!this.idProyectos) {
      this.router.navigate(['/proyectos']);
    }
  }

  ngAfterViewInit(): void {

    this.map = this.creationMap.createMap(this.map)
    this.getTodosLosProyectosByIds(this.idProyectos).then(any => {
      for (const visualizadorProyectoEnMapa of this.visualizadoresProyectosEnMapa) {
        visualizadorProyectoEnMapa.putDataOnMap(this.map, this.fechasDelSlider);
      }

      this.ordenarFechas();
      this.agregarTodosLosTiposDe();
    });

    this.buttonFunctions();
  }

  ordenarFechas() {
    this.fechasDelSlider.sort();
  }

  agregarTodosLosTiposDe() {
    for (const visualizadorProyectoEnMapa of this.visualizadoresProyectosEnMapa) {
      this.tiposLugares = ArreglosController.unionArreglos(this.tiposLugares, visualizadorProyectoEnMapa.controladorDatoEnMapaDinamico[NRO_LUGAR].filtroController.tiposDe)
      this.tiposZonas = ArreglosController.unionArreglos(this.tiposZonas, visualizadorProyectoEnMapa.controladorDatoEnMapaDinamico[NRO_ZONA].filtroController.tiposDe)
      this.tiposTrayectos = ArreglosController.unionArreglos(this.tiposTrayectos, visualizadorProyectoEnMapa.controladorDatoEnMapaDinamico[NRO_TRAYECTO].filtroController.tiposDe)
    }
  }

  async getTodosLosProyectosByIds(idProyectos: number[]) {
    const dataPackage = await this.proyectoService.getProyectosByIDs(idProyectos).toPromise();
    let i = 0;
    for (const proyecto of (dataPackage.data as Proyecto[])) {
      this.visualizadoresProyectosEnMapa[i] = new VisualizadorProyectoEnMapa;
      this.visualizadoresProyectosEnMapa[i].setData(proyecto);
      i++;
    }
  }

  checkboxVerEnElTiempo() {
    this.creationMap.actualizarFecha(this.inputSlider, this.labelFecha,this.fechasDelSlider);

    for (const visualizadorProyectoEnMapa of this.visualizadoresProyectosEnMapa) {
      visualizadorProyectoEnMapa.checkboxVerEnElTiempo(this.checkVerEnElTiempo.checked, this.map, this.fechasDelSlider[this.inputSlider.value]);
    }
  }

  ocultarDataChecked(nroControlador: number) {
    for (const visualizadorProyectoEnMapa of this.visualizadoresProyectosEnMapa) {
      visualizadorProyectoEnMapa.ocultarDataChecked(nroControlador, this.checkVerEnElTiempo.checked, this.map, this.fechasDelSlider[this.inputSlider.value])
    }
  }

  hideByTipoDeIsChecked(nroControlador: number, tipoDe: string) {
    for (const visualizadorProyectoEnMapa of this.visualizadoresProyectosEnMapa) {
      visualizadorProyectoEnMapa.ocultarTipoDeIsChecked(nroControlador, tipoDe, this.map, this.checkVerEnElTiempo.checked, this.fechasDelSlider[this.inputSlider.value])
    }
  }

  showLayerGroupProyecto(visualizadorProyectoEnMapa: VisualizadorProyectoEnMapa) {
    visualizadorProyectoEnMapa.ocultarProyectoisChecked(this.checkVerEnElTiempo.checked, this.map, this.fechasDelSlider[this.inputSlider.value])
  }

  updateTemporaryMap() {
    this.creationMap.actualizarFecha(this.inputSlider, this.labelFecha,this.fechasDelSlider);

    for (const visualizadorProyectoEnMapa of this.visualizadoresProyectosEnMapa) {
      visualizadorProyectoEnMapa.updateTemporaryMap(this.map, this.fechasDelSlider[this.inputSlider.value])
    }
  }

  buttonFunctions() {
    this.labelFecha = document.getElementById("labelFecha");
    this.inputSlider = <HTMLInputElement>document.getElementById("inputSlider");
    this.checkVerEnElTiempo = <HTMLInputElement>document.getElementById("checkVerEnElTiempo");

    this.inputSlider.addEventListener("input", () => {
      this.updateTemporaryMap();
    }, false);

  }

  fechaAnterior() {
    this.inputSlider.value = (this.number(this.inputSlider.value) - 1) + "";
    this.checkboxVerEnElTiempo()
  }

  //TODO: posible componente Multimedia / Reproductor dinamico
  async playAndPause() {
    const speed = 300
    document.getElementById("play").className = "btn btn-info fa fa-pause";   //Cambio icono
    this.playing = !this.playing

    if (this.playing && this.fechasDelSlider.length - 1 == this.number(this.inputSlider.value)) {   //Si es la ultima fecha vuelve al principio para iniciar
      this.primerFecha()
    }
    while (this.fechasDelSlider.length - 1 > this.number(this.inputSlider.value) && this.playing) {   //Inicia el Play 
      await this.delay(speed / (Number(this.selectedSpeed) ? Number(this.selectedSpeed) : 1)).then(any => {
        this.fechaSiguiente()
      });
    }
    this.playing = false
    document.getElementById("play").className = "btn btn-info fa fa-play";    //Cambio icono
  }

  fechaSiguiente() {
    this.inputSlider.value = (this.number(this.inputSlider.value) + 1) + "";
    this.checkboxVerEnElTiempo()
  }

  primerFecha() {
    this.inputSlider.value = 0 + "";
    this.checkboxVerEnElTiempo()
  }

  ultimaFecha() {
    this.inputSlider.value = (this.fechasDelSlider.length - 1) + "";
    this.checkboxVerEnElTiempo()
  }

  changeSpeed(selectedItem: string) {
    this.selectedSpeed = selectedItem;
  }

  number(aNumber: string) {
    return Number(aNumber)
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(() => resolve(), ms)).then();
  }

  goBack(): void {
    this.location.back();
  }
}

