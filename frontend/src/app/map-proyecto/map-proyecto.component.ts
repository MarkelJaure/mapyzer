import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { CryptoService } from '../services/crypto.service';
import { } from "@angular/common/http";

import { ProyectoService } from '../services/proyecto.service';

import { CreationMap } from '../lib/ControladoresEnMapaDinamico/CreationMap';
import { VisualizadorProyectoEnMapa } from '../lib/ControladoresEnMapaDinamico/VisualizadorProyectoEnMapa';
import { Proyecto } from '../models/proyecto';
import { ArreglosController } from '../lib/ArreglosController';
import { NRO_LUGAR, NRO_TRAYECTO, NRO_ZONA } from '../lib/data.config';

@Component({
  selector: 'app-map',
  templateUrl: './map-proyecto.component.html',
  styleUrls: ['./map-proyecto.component.css'],
})

export class MapProyectoComponent implements AfterViewInit {
  private map;
  private readonly fechasDelSlider = new Array();

  private labelFecha = document.getElementById("labelFecha");
  inputSlider = <HTMLInputElement>document.getElementById("inputSlider");
  checkVerEnElTiempo = <HTMLInputElement>document.getElementById("checkVerEnElTiempo");

  readonly NRO_LUGAR = NRO_LUGAR
  readonly NRO_ZONA = NRO_ZONA
  readonly NRO_TRAYECTO = NRO_TRAYECTO

  idEncripted;
  playing = false
  selectedSpeed = "Velocidad"

  creationMap = new CreationMap;

  visualizadorProyectoEnMapa = new VisualizadorProyectoEnMapa;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly proyectoService: ProyectoService,
    private readonly cryptoService: CryptoService,
  ) { }

  ngAfterViewInit(): void {

    this.map = this.creationMap.createMap(this.map)

    this.getDatosProyecto().then(any => {
      this.visualizadorProyectoEnMapa.putDataOnMap(this.map, this.fechasDelSlider);
      ArreglosController.ordenar(this.fechasDelSlider);
    });

    this.buttonFunctions();
  }

  async getDatosProyecto(): Promise<void> {
    this.idEncripted = this.route.snapshot.paramMap.get('id')
    const id = this.cryptoService.decryptURL(this.idEncripted);
    const dataPackage = await this.proyectoService.getDatosProyecto(+id).toPromise();
    this.visualizadorProyectoEnMapa.setData((dataPackage.data as Proyecto));
  }


  checkboxVerEnElTiempo() {
    this.creationMap.actualizarFecha(this.inputSlider, this.labelFecha, this.fechasDelSlider);
    this.visualizadorProyectoEnMapa.checkboxVerEnElTiempo(this.checkVerEnElTiempo.checked, this.map, this.fechasDelSlider[this.inputSlider.value]);
  }

  ocultarDataChecked(nroControlador) {
    this.visualizadorProyectoEnMapa.ocultarDataChecked(nroControlador, this.checkVerEnElTiempo, this.map, this.fechasDelSlider[this.inputSlider.value])
  }

  updateTemporaryMap() {
    this.creationMap.actualizarFecha(this.inputSlider, this.labelFecha, this.fechasDelSlider);
    this.visualizadorProyectoEnMapa.updateTemporaryMap(this.map, this.fechasDelSlider[this.inputSlider.value])
  }

  hideByTipoDeIsChecked(nroControlador, tipoDe) {
    this.visualizadorProyectoEnMapa.ocultarTipoDeIsChecked(nroControlador, tipoDe, this.map, this.checkVerEnElTiempo.checked, this.fechasDelSlider[this.inputSlider.value])
  }

  fechaAnterior() {
    this.inputSlider.value = (this.number(this.inputSlider.value) - 1) + "";
    this.checkboxVerEnElTiempo()
  }

  async playAndPause() {
    const speed = 300
    document.getElementById("play").className = "btn btn-info fa fa-pause";   //Cambio icono
    this.playing = !this.playing

    if (this.playing && (this.fechasDelSlider.length - 1 == this.number(this.inputSlider.value))) {   //Si es la ultima fecha vuelve al principio para iniciar
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

  buttonFunctions() {
    this.labelFecha = document.getElementById("labelFecha");
    this.inputSlider = <HTMLInputElement>document.getElementById("inputSlider");
    this.checkVerEnElTiempo = <HTMLInputElement>document.getElementById("checkVerEnElTiempo");

    this.inputSlider.addEventListener("input", () => {
      this.updateTemporaryMap();
    }, false);

  }

  //TODO: componente helper, o algo asi 

  number(aNumber: string) {
    return Number(aNumber)
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(() => resolve(), ms)).then();
  }



}