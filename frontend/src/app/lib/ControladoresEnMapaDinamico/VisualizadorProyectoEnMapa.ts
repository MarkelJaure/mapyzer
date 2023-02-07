import { Proyecto } from '../../models/proyecto';

import { VerEnElTiempoController } from './VerEnElTiempoController';
import { FiltroFactory, FiltroController } from './FiltrosController';
import { DataOnMapFactory, DataOnMapController } from './DataOnMapController';
import { ArreglosController } from '../ArreglosController';
import { LUGAR, NRO_LUGAR, NRO_TRAYECTO, NRO_ZONA, TRAYECTO, ZONA } from '../data.config';

export class VisualizadorProyectoEnMapa {

  proyecto: Proyecto;
  isOculto: boolean = false;
  controladorDatoEnMapaDinamico: Array<ControladorDatoEnMapaDinamico> = new Array();

  constructor(){
    const verEnElTiempoController = new VerEnElTiempoController

    const filtroLugar = FiltroFactory.crearFiltro(LUGAR)
    const filtroZona = FiltroFactory.crearFiltro(ZONA)
    const filtroTrayecto = FiltroFactory.crearFiltro(TRAYECTO)

    const lugarOnMapController =  DataOnMapFactory.crearDataOnMapController(LUGAR);
    const zonaOnMapController =  DataOnMapFactory.crearDataOnMapController(ZONA);
    const trayectoOnMapController =  DataOnMapFactory.crearDataOnMapController(TRAYECTO);

    this.controladorDatoEnMapaDinamico[NRO_LUGAR] = new ControladorDatoEnMapaDinamico(verEnElTiempoController, filtroLugar, lugarOnMapController);
    this.controladorDatoEnMapaDinamico[NRO_ZONA] = new ControladorDatoEnMapaDinamico(verEnElTiempoController, filtroZona, zonaOnMapController);
    this.controladorDatoEnMapaDinamico[NRO_TRAYECTO] = new ControladorDatoEnMapaDinamico(verEnElTiempoController, filtroTrayecto,trayectoOnMapController);
  }

  setData(proyecto: Proyecto) {
    this.proyecto = proyecto;

    this.controladorDatoEnMapaDinamico[NRO_LUGAR].setDatos(this.proyecto.lugares)
    this.controladorDatoEnMapaDinamico[NRO_ZONA].setDatos(this.proyecto.zonas)
    this.controladorDatoEnMapaDinamico[NRO_TRAYECTO].setDatos(this.proyecto.trayectos)
  }

  ocultarDataChecked(nroControlador: number, IsVerEnElTiempoChecked, map, aDate) {
    this.controladorDatoEnMapaDinamico[nroControlador].ocultarDataChecked(map)
    if (!this.isOculto) {
      this.controladorDatoEnMapaDinamico[nroControlador].actualizarDatos(map, IsVerEnElTiempoChecked, aDate)
    }
  }

  ocultarTipoDeIsChecked(nroControlador: number, tipoDe, map, IsVerEnElTiempoChecked, aDate) {
    this.controladorDatoEnMapaDinamico[nroControlador].ocultarTipoDeIsChecked(tipoDe, map)
    if (!this.isOculto) {
      this.controladorDatoEnMapaDinamico[nroControlador].mostrarTiposDeValidos(tipoDe, map)
      this.controladorDatoEnMapaDinamico[nroControlador].actualizarDatos(map, IsVerEnElTiempoChecked, aDate)
    }
  }

  ocultarProyectoisChecked(IsVerEnElTiempoChecked, map, aDate) {
    this.isOculto = !this.isOculto;
    if (this.isOculto) {
      this.ocultarDataOnMap(map);
    }
    else {
      this.checkboxVerEnElTiempo(IsVerEnElTiempoChecked, map, aDate)
    }
  }

  mostrarProyecto(map) {
    this.isOculto = false
    this.showValidByFiltersDataOnMap(map);
  }

  putDataOnMap(map, fechasDelSlider) {
    this.addVisualDataOnMap(map);
    this.addFechasOnFechaRef(fechasDelSlider);
    this.addTipoOnTiposDe();
  }

  checkboxVerEnElTiempo(IsVerEnElTiempoChecked, map, aDate) {
    if (!this.isOculto) {
      if (IsVerEnElTiempoChecked) {
        this.updateTemporaryMap(map, aDate);
      } else {
        this.showValidByFiltersDataOnMap(map);
      }
    }
  }

  updateTemporaryMap(map, aDate) {
    if (!this.isOculto) {
      this.clearNonInfiniteDataOnMap(map);
      this.putTemporaryDataOnMap(map, aDate);
    }
  }

  private ocultarDataOnMap(map) {
    this.controladorDatoEnMapaDinamico[NRO_LUGAR].ocultarDataOnMap(map)
    this.controladorDatoEnMapaDinamico[NRO_ZONA].ocultarDataOnMap(map)
    this.controladorDatoEnMapaDinamico[NRO_TRAYECTO].ocultarDataOnMap(map)
  }

  private putTemporaryDataOnMap(map, aDate) {
    this.controladorDatoEnMapaDinamico[NRO_LUGAR].putTemporary(map, aDate)
    this.controladorDatoEnMapaDinamico[NRO_ZONA].putTemporary(map, aDate)
    this.controladorDatoEnMapaDinamico[NRO_TRAYECTO].putTemporary(map, aDate)
  }

  private clearNonInfiniteDataOnMap(map) {
    this.controladorDatoEnMapaDinamico[NRO_LUGAR].clearNonInfinite(map)
    this.controladorDatoEnMapaDinamico[NRO_ZONA].clearNonInfinite(map)
    this.controladorDatoEnMapaDinamico[NRO_TRAYECTO].clearNonInfinite(map)
  }

  private showValidByFiltersDataOnMap(map) {
    this.controladorDatoEnMapaDinamico[NRO_LUGAR].showValidByFilters(map)
    this.controladorDatoEnMapaDinamico[NRO_ZONA].showValidByFilters(map)
    this.controladorDatoEnMapaDinamico[NRO_TRAYECTO].showValidByFilters(map)
  }

  private addVisualDataOnMap(map) {
    this.controladorDatoEnMapaDinamico[NRO_LUGAR].makeDataOnMap(map);
    this.controladorDatoEnMapaDinamico[NRO_ZONA].makeDataOnMap(map);
    this.controladorDatoEnMapaDinamico[NRO_TRAYECTO].makeDataOnMap(map);
  }

  private addFechasOnFechaRef(fechasDelSlider) {
    this.controladorDatoEnMapaDinamico[NRO_LUGAR].addFechasForTemporarySlider(fechasDelSlider)
    this.controladorDatoEnMapaDinamico[NRO_ZONA].addFechasForTemporarySlider(fechasDelSlider)
    this.controladorDatoEnMapaDinamico[NRO_TRAYECTO].addFechasForTemporarySlider(fechasDelSlider)
  }

  private addTipoOnTiposDe() {
    this.controladorDatoEnMapaDinamico[NRO_LUGAR].addAllTiposToTiposDe();
    this.controladorDatoEnMapaDinamico[NRO_ZONA].addAllTiposToTiposDe();
    this.controladorDatoEnMapaDinamico[NRO_TRAYECTO].addAllTiposToTiposDe();

  }
}

class ControladorDatoEnMapaDinamico {

  datos = new Array();
  visualDatos = new Array();
  verEnElTiempoController: VerEnElTiempoController;
  filtroController: FiltroController;
  dataOnMapController: DataOnMapController;

  constructor(aVerEnElTiempoController, aFiltroController, aDataOnMapController) {
    this.verEnElTiempoController = aVerEnElTiempoController;
    this.filtroController = aFiltroController;
    this.dataOnMapController = aDataOnMapController
  }

  setDatos(someDatos) {
    this.datos = someDatos
  }

  ocultarDataChecked(map) {
    this.filtroController.hideIsChecked = !this.filtroController.hideIsChecked

    if (this.filtroController.hideIsChecked) {
      this.dataOnMapController.removeVisualDataOfMap(map, this.visualDatos);
    }
  }

  actualizarDatos(map, IsVerEnElTiempoChecked, aDate) {
    if (IsVerEnElTiempoChecked) {
      this.clearNonInfinite(map);
      this.putTemporary(map, aDate);
    } else {
      this.showValidByFilters(map)
    }
  }

  ocultarTipoDeIsChecked(tipoDe, map) {
    if (!this.filtroController.tipoDeCheckedContains(tipoDe)) {
      this.filtroController.addToTipoDeChecked(tipoDe)
      const invalidVisualData = this.filtroController.removeByTipoDe(this.datos, this.visualDatos, tipoDe)
      this.dataOnMapController.removeVisualDataOfMap(map, invalidVisualData)

    } else {
      this.filtroController.tipoDeChecked = this.filtroController.removeToTipoDeChecked(this.filtroController.tipoDeChecked, tipoDe)
    }
  }

  mostrarTiposDeValidos(tipoDe, map) {
    if (!this.filtroController.tipoDeCheckedContains(tipoDe) && !this.filtroController.hideIsChecked) {
      const validVisualData = this.filtroController.addByTipoDe(this.datos, this.visualDatos, tipoDe)
      this.dataOnMapController.addVisualDataToMap(map, validVisualData)
    }
  }

  putTemporary(map, aDate) {

    const validosSegunFiltro = this.filtroController.areValidByFiltros(this.datos, this.visualDatos);
    const validosSegunFecha = this.verEnElTiempoController.areValidByFecha(this.datos, this.visualDatos, aDate);

    const validosEnFechaYFiltro = ArreglosController.interseccionArreglos(validosSegunFecha, validosSegunFiltro)

    this.dataOnMapController.addVisualDataToMap(map, validosEnFechaYFiltro)
  }

  ocultarDataOnMap(map) {
    this.dataOnMapController.removeVisualDataOfMap(map, this.visualDatos)
  }

  addAllTiposToTiposDe() {
    this.filtroController.addAllTiposToTiposDe(this.datos);
  }

  addFechasForTemporarySlider(fechasDelSlider) {
    this.verEnElTiempoController.addFechasForTemporarySlider(this.datos, fechasDelSlider)
  }

  makeDataOnMap(map) {
    this.visualDatos = this.dataOnMapController.makeVisualDataByData(this.datos)
    this.dataOnMapController.addVisualDataToMap(map, this.visualDatos)

  }

  showValidByFilters(map) {
    this.dataOnMapController.removeVisualDataOfMap(map, this.visualDatos)
    const validosSegunFiltros = this.filtroController.areValidByFiltros(this.datos, this.visualDatos);
    this.dataOnMapController.addVisualDataToMap(map, validosSegunFiltros)
  }

  clearNonInfinite(map) {
    const nonInfiniteData = this.verEnElTiempoController.clearNonInfinite(this.datos, this.visualDatos);
    this.dataOnMapController.removeVisualDataOfMap(map, nonInfiniteData)
  }
}