import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap, switchMap, map } from 'rxjs/operators';
import { Proyecto } from '../models/proyecto';
import { ProyectoService } from '../services/proyecto.service';
import { Lugar } from '../models/lugar';
import { ZonaService } from '../services/zona.service';
import { LugarService } from '../services/lugar.service';
import { ResultsPage } from '../models/results-page';
import { ModalService } from "../services/modal.service";
import { Zona } from '../models/zona';
import { Trayecto } from '../models/trayecto';
import { TrayectoService } from '../services/trayecto.service';
import { ToastService } from '../services/toast.service';
import { UsuarioService } from '../services/usuario.service';
import * as XLSX from 'xlsx'
import { CryptoService } from '../services/crypto.service';


const ESQUEMA_1 = 0;
const ESQUEMA_2 = 1;
const ESQUEMA_3 = 2;
const ESQUEMA_4 = 3;
import * as Papa from 'papaparse'
import { saveAs } from 'file-saver';
import { Usuario } from '../models/usuario';
import { ParseadorDeFecha } from '../lib/ParseadorDeFecha';
import { DataMultipleAccionController } from '../lib/DataMultipleAccionController';

@Component({
  selector: 'app-datos-proyecto',
  templateUrl: './datos-proyecto.component.html',
  styleUrls: ['./datos-proyecto.component.css']
})

export class DatosProyectoComponent implements OnInit {

  proyecto: Proyecto;
  misProyectos: Proyecto[]
  size = 10;
  searching = false;
  searchFailed = false;
  nombre = '';
  fecha = '';
  calle = [];
  ciudad = [];
  lugares;
  lugaresParsed = false;
  direcciones;
  calleDir = [];
  ciudadDir = [];
  direccionesParsed = false;
  zonas;
  zonasParsed = false;
  trayectos;
  trayectosParsed = false;
  pagesEsquema: number[][] = new Array();
  resultsPageEsquema: ResultsPage[] = new Array() as ResultsPage[];
  currentPageEsquema: number[] = [1, 1, 1, 1];
  seleccionandoCopiar: boolean = false
  seleccionandoEliminar: boolean = false
  currentUser: Usuario;
  error = '';

  idEncriptado;
  newEncriptado;
  idLugaresCoordenadasEncriptados = new Array()
  idLugaresDireccionesEncriptados = new Array()
  idZonasEncriptados = new Array()
  idTrayectosEncriptados = new Array()

  //Nuevas Variables
  lugaresCoordenadasMultipleAccionController = new DataMultipleAccionController
  lugaresDireccionesMultipleAccionController = new DataMultipleAccionController
  zonasMultipleAccionController = new DataMultipleAccionController
  trayectosMultipleAccionController = new DataMultipleAccionController

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private proyectoService: ProyectoService,
    private lugarService: LugarService,
    private zonaService: ZonaService,
    private trayectoService: TrayectoService,
    private modalService: ModalService,
    public toastService: ToastService,
    public usuarioService: UsuarioService,
    public cryptoService: CryptoService
  ) {
    this.usuarioService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.newEncriptado = this.cryptoService.encryptURL('new')
    this.getProyecto();
    this.getLugaresCoordenadas();
    this.getLugaresDireccion();
    this.getZonas();
    this.getTrayectos();
    if (this.currentUser) {
      this.getMisProyectos();
    }

  }

  getLugaresCoordenadas(): void {
    this.formatFilter()
    this.idLugaresCoordenadasEncriptados = new Array()
    const id = this.cryptoService.decryptURL(this.route.snapshot.paramMap.get('id'));
    this.lugarService.getByProyectoByPage(+id, this.currentPageEsquema[ESQUEMA_1], this.size, this.nombre, this.fecha, 1, true).subscribe((dataPackage) => {
      this.resultsPageEsquema[ESQUEMA_1] = (dataPackage.data) as ResultsPage;
      this.pagesEsquema[ESQUEMA_1] = Array.from(Array(this.resultsPageEsquema[ESQUEMA_1].last).keys());

      for (let nombre of this.resultsPageEsquema[ESQUEMA_1].results) {
        var theLugar = <Lugar>nombre;
        this.idLugaresCoordenadasEncriptados.push(this.cryptoService.encryptURL('' + theLugar.id))
        theLugar.validity = ParseadorDeFecha.parsearFecha(theLugar.validity)
      }
    });
    this.lugarService.getLugaresWithDir('1', id, true).subscribe((dataPackage) => {
      this.lugares = dataPackage.data
    })
  }

  getLugaresDireccion() {
    this.formatFilter()
    this.idLugaresDireccionesEncriptados = new Array()
    const id = this.cryptoService.decryptURL(this.route.snapshot.paramMap.get('id'));
    this.lugarService.getByProyectoByPage(+id, this.currentPageEsquema[ESQUEMA_2], this.size, this.nombre, this.fecha, 2, true).subscribe((dataPackage) => {
      this.resultsPageEsquema[ESQUEMA_2] = <ResultsPage>dataPackage.data;
      this.pagesEsquema[ESQUEMA_2] = Array.from(Array(this.resultsPageEsquema[ESQUEMA_2].last).keys());
      var i = 0
      for (let nombre of this.resultsPageEsquema[ESQUEMA_2].results) {
        var theLugar = <Lugar>nombre;
        this.idLugaresDireccionesEncriptados.push(this.cryptoService.encryptURL('' + theLugar.id))
        var cadenas = theLugar.localizacion.split(",");
        this.ciudad[i] = cadenas.pop();
        this.calle[i] = cadenas.pop();
        i++;
        theLugar.validity = ParseadorDeFecha.parsearFecha(theLugar.validity)
      }
    });
    this.lugarService.getLugaresWithDir('0', id, true).subscribe((dataPackage) => {
      this.direcciones = dataPackage.data;
    })
  }

  getZonas(): void {
    this.formatFilter()
    this.idZonasEncriptados = new Array()
    const id = this.cryptoService.decryptURL(this.route.snapshot.paramMap.get('id'));
    this.zonaService.getByProyectoByPage(+id, this.currentPageEsquema[ESQUEMA_3], this.size, this.nombre, this.fecha, true).subscribe((dataPackage) => {
      this.resultsPageEsquema[ESQUEMA_3] = (dataPackage.data) as ResultsPage;
      this.pagesEsquema[ESQUEMA_3] = Array.from(Array(this.resultsPageEsquema[ESQUEMA_3].last).keys());
      for (let zona of this.resultsPageEsquema[ESQUEMA_3].results) {
        var theZona = <Zona>zona;
        this.idZonasEncriptados.push(this.cryptoService.encryptURL('' + theZona.id))
        theZona.validity = ParseadorDeFecha.parsearFecha(theZona.validity)
      }
    });
    this.zonaService.getByProyecto(id,true).subscribe((dataPackage) => {
      this.zonas = dataPackage.data
    })
  }

  getTrayectos(): void {
    this.formatFilter()
    this.idTrayectosEncriptados = new Array()
    const id = this.cryptoService.decryptURL(this.route.snapshot.paramMap.get('id'));
    this.trayectoService.getByProyectoByPage(+id, this.currentPageEsquema[ESQUEMA_4], this.size, this.nombre, this.fecha, true).subscribe((dataPackage) => {
      this.resultsPageEsquema[ESQUEMA_4] = (dataPackage.data) as ResultsPage;
      this.pagesEsquema[ESQUEMA_4] = Array.from(Array(this.resultsPageEsquema[ESQUEMA_4].last).keys());
      for (let trayecto of this.resultsPageEsquema[ESQUEMA_4].results) {
        var theTrayecto = <Trayecto>trayecto;
        this.idTrayectosEncriptados.push(this.cryptoService.encryptURL('' + theTrayecto.id))
        theTrayecto.validity = ParseadorDeFecha.parsearFecha(theTrayecto.validity)
      }
    });
    this.trayectoService.getByProyecto(id,true).subscribe(dataPackage => {
      this.trayectos = dataPackage.data
    })
  }

  getProyecto() {
    const id = this.cryptoService.decryptURL(this.route.snapshot.paramMap.get('id'));
    this.proyectoService.get(+id).subscribe((dataPackage) => {
      this.proyecto = (dataPackage.data as Proyecto);
      this.proyecto.timegen = new Date(this.proyecto.timegen);
      this.idEncriptado = this.cryptoService.encryptURL('' + this.proyecto.id)

      if (this.proyecto.visibilidad == "privado" && !this.usuarioService.isCreatedByMe(this.proyecto)) {
        this.router.navigate(['/']);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  addLugar(): void {
    this.proyecto.lugares.push({
      tipos_lugare: undefined,
      id: null,
      codigo: null,
      lugar: null,
      punto: { type: null, coordinates: null },
      descripcion: null,
      id_tipo_lugar: null,
      validity: null,
      localizacion: null,
      zona: null,
      isvalid: true,
    });
  }

  removeLugarCoordenadas(lugar: Lugar): void {
    const modalRef = this.modalService.open("Eliminar", "¿Está seguro que desea borrar esta refencia?", "Si lo hace, no podrá usarla nuevamente.").then(
      (_) => {
        this.proyectoService.removeLugarCoordenadas(this.proyecto.id, lugar.id).subscribe(() => {
          this.getLugaresCoordenadas();
        });
      },
      (_) => {
      }
    );

  }

  removeLugarDireccion(lugar: Lugar): void {
    const modalRef = this.modalService.open("Eliminar", "¿Está seguro que desea borrar esta refencia?", "Si lo hace, no podrá usarla nuevamente.").then(
      (_) => {
        this.proyectoService.removeLugarDireccion(this.proyecto.id, lugar.id).subscribe(() => {
          this.getLugaresDireccion();
        });
      },
      (_) => {
      }
    );

  }

  removeZona(zona: Zona): void {
    const modalRef = this.modalService.open("Eliminar", "¿Está seguro que desea borrar esta refencia?", "Si lo hace, no podrá usarla nuevamente.").then(
      (_) => {
        this.proyectoService.removeZona(this.proyecto.id, zona.id).subscribe(() => {
          this.getZonas();
        });
      },
      (_) => {
      }
    );

  }

  removeTrayecto(trayecto: Trayecto): void {
    const modalRef = this.modalService.open("Eliminar", "¿Está seguro que desea borrar esta refencia?", "Si lo hace, no podrá usarla nuevamente.").then(
      (_) => {
        this.proyectoService.removeTrayecto(this.proyecto.id, trayecto.id).subscribe(() => {
          this.getTrayectos();
        });
      },
      (_) => {
      }
    );

  }

  save(): void {
    this.proyectoService.save(this.proyecto)
      .subscribe(dataPackage => {
        this.proyecto = (dataPackage.data as Proyecto);
        this.goBack();
      });
  }

  searchLugar = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.lugarService
          .search(term)
          .pipe(map((response) => response.data))
          .pipe(
            tap(() => (this.searchFailed = false)),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            })
          )
      ),
      tap(() => (this.searching = false))
    )

  resultCodigoFormat(value: any) {
    return value.codigo;
  }

  inputCodigoFormat(value: any) {
    if (value) {
      return value.codigo;
    }
    return null;
  }

  resultLugarFormat(value: any) {
    return value.nombre;
  }

  inputLugarFormat(value: any) {
    if (value) {
      return value.nombre;
    }
    return null;
  }

  resultTipoLugarFormat(value: any) {
    return value.tipoLugar;
  }

  inputTipoLugarFormat(value: any) {
    if (value) {
      return value.tipoLugar;
    }
    return null;
  }

  resultPuntoFormat(value: any) {
    return value.punto;
  }

  inputPuntoFormat(value: any) {
    if (value) {
      return value.punto;
    }
    return null;
  }

  open(): void {
    const modalRef = this.modalService.nuevoLugar(this.cryptoService.decryptURL(this.route.snapshot.paramMap.get('id')));
  }

  showPageEsquema(pageId: number, esquemaNro: number): void {

    if (!this.currentPageEsquema[esquemaNro]) {
      this.currentPageEsquema[esquemaNro] = 1;
    }

    let page = pageId;
    if (pageId === -2) { // First
      page = 1;
    }
    if (pageId === -1) { // Previous
      page = this.currentPageEsquema[esquemaNro] > 1 ? this.currentPageEsquema[esquemaNro] - 1 : this.currentPageEsquema[esquemaNro];
    }
    if (pageId === -3) { // Next
      page = this.currentPageEsquema[esquemaNro] < this.resultsPageEsquema[esquemaNro].last ? this.currentPageEsquema[esquemaNro] + 1 : this.currentPageEsquema[esquemaNro];
    }
    if (pageId === -4) { // Last
      page = this.resultsPageEsquema[esquemaNro].last;
    }
    if (pageId > 1 && this.pagesEsquema[esquemaNro].length >= pageId) { // Number
      page = this.pagesEsquema[esquemaNro][pageId - 1] + 1;
    }
    this.currentPageEsquema[esquemaNro] = page;

    switch (esquemaNro) {
      case ESQUEMA_1:
        this.getLugaresCoordenadas();
        break;
      case ESQUEMA_2:
        this.getLugaresDireccion();
        break;
      case ESQUEMA_3:
        this.getZonas();
        break;
      case ESQUEMA_4:
        this.getTrayectos();
        break;
      default:
        break;
    }
  }

  formatFilter() {
    if (this.nombre === undefined) {
      this.nombre = "";
    }
    if (this.fecha === undefined) {
      this.fecha = "";
    }
  }

  async export(type: string) {
    let csv;
    let filename = '';
    let blob;
    switch (type) {
      case 'Lugares':
        if (!this.lugaresParsed) {
          this.lugaresParsed = true
          this.parseLugares()
        }
        filename = `Lugares_Proyecto_${this.proyecto.proyecto}.csv`
        csv = this.parseJsonToCsv(this.lugares)
        blob = new Blob([csv], { type: 'text/csv' });
        break;
      case 'LugaresXLS':
        if (!this.lugaresParsed) {
          this.lugaresParsed = true
          this.parseLugares()
        }
        filename = `Lugares_Proyecto_${this.proyecto.proyecto}.xls`
        csv = this.parseJsonToCsv(this.lugares)
        blob = new Blob([csv], { type: 'application/vnd.ms-excel' });
        break;
      case 'Direcciones':
        if (!this.direccionesParsed) {
          this.direccionesParsed = true
          this.parseLugaresWithDir()
        }
        filename = `Direcciones_Proyecto_${this.proyecto.proyecto}.csv`
        csv = this.parseJsonToCsv(this.direcciones)
        blob = new Blob([csv], { type: 'text/csv' });
        break;
      case 'DireccionesXLS':
        if (!this.direccionesParsed) {
          this.direccionesParsed = true
          this.parseLugaresWithDir()
        }
        filename = `Direcciones_Proyecto_${this.proyecto.proyecto}.xls`
        csv = this.parseJsonToCsv(this.direcciones)
        blob = new Blob([csv], { type: 'application/vnd.ms-excel' });
        break;
      case 'Zonas':
        if (!this.zonasParsed) {
          this.zonasParsed = true
          this.parseZonas()
        }
        filename = `Zonas_Proyecto_${this.proyecto.proyecto}.csv`
        csv = this.parseJsonToCsv(this.zonas)
        blob = new Blob([csv], { type: 'text/csv' });
        break;
      case 'ZonasXLS':
        if (!this.zonasParsed) {
          this.zonasParsed = true
          this.parseZonas()
        }
        filename = `Zonas_Proyecto_${this.proyecto.proyecto}.xls`
        csv = this.parseJsonToCsv(this.zonas)
        blob = new Blob([csv], { type: 'application/vnd.ms-excel' });
        break;
      case 'Trayectos':
        if (!this.trayectosParsed) {
          this.trayectosParsed = true
          this.parseTrayectos()
        }
        filename = `Trayectos_Proyecto_${this.proyecto.proyecto}.csv`
        csv = this.parseJsonToCsv(this.trayectos)
        blob = new Blob([csv], { type: 'text/csv' });
        break;
      case 'TrayectosXLS':
        if (!this.trayectosParsed) {
          this.trayectosParsed = true
          this.parseTrayectos()
        }

        filename = `Trayectos_Proyecto_${this.proyecto.proyecto}.xls`
        let ws = XLSX.utils.json_to_sheet(this.trayectos, { skipHeader: false })
        let wb = XLSX.utils.book_new()
        wb.SheetNames.push("Sheet1")
        wb.Sheets['Sheet1'] = ws
        let wbout = XLSX.write(wb, { bookType: 'xlsx', type: "binary" })
        saveAs(new Blob([this.s2ab(wbout)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), filename)
        // csv = this.parseJsonToCsv(this.trayectos)
        // blob = new Blob([ws], {type: 'application/vnd.ms-excel'});
        break;
    }

    saveAs(blob, filename)
  }

  s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
  }

  parseJsonToCsv(data: any): any {

    const config = {
      quotes: false, //or array of booleans
      quoteChar: '"',
      escapeChar: '"',
      delimiter: ",",
      header: true,
      newline: "\r\n",
      skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
      columns: null //or array of strings
    }
    return Papa.unparse(data, config)
  }

  private parseTrayectos() {
    this.trayectos.forEach(trayecto => {
      trayecto.nombre = trayecto.trayecto
      trayecto.tipoTrayecto = trayecto.tipos_trayecto.tipo_trayecto
      delete trayecto.trayecto
      delete trayecto.observaciones
      delete trayecto.id
      trayecto.tInicio = trayecto.validity[0].value
      trayecto.tFinal = trayecto.validity[1].value
      delete trayecto.validity
      delete trayecto.proyectos
      trayecto.tipoTrayecto = trayecto.tipos_trayecto.tipo_trayecto
      delete trayecto.tipos_trayecto
      delete trayecto.id_tipo_trayecto
      trayecto.nombre = trayecto.trayecto
      delete trayecto.trayecto
      trayecto.coordenadas = trayecto.curva.coordinates
      delete trayecto.curva
    })
  }

  private parseZonas() {
    this.zonas.forEach(zona => {
      zona.coordenadas = zona.poligono.coordinates[0]
      delete zona.poligono
      zona.nombre = zona.zona;
      delete zona.zona
      zona.tInicio = zona.validity[0].value
      zona.tFinal = zona.validity[1].value
      delete zona.validity
      delete zona.id
      delete zona.id_tipo_zona
      delete zona.zona_super
      zona.tipoZona = zona.tipos_zona.tipo_zona
      zona.tipoZona = zona.tipoZona.toLowerCase()
      delete zona.tipos_zona
      delete zona.punto_ref
      delete zona.proyectos
      delete zona.observaciones
    })
  }

  private parseLugares(): void {
    this.lugares.forEach(lugar => {
      lugar.lat = lugar.punto.coordinates[0];
      lugar.lon = lugar.punto.coordinates[1];
      delete lugar.punto;
      delete lugar.id_tipo_lugar
      delete lugar.proyectos
      lugar.tInicio = lugar.validity[0].value
      lugar.tFinal = lugar.validity[1].value
      delete lugar.validity
      lugar.nombre = lugar.lugar
      delete lugar.lugar
      delete lugar.id
      delete lugar.localizacion
      lugar.tipoLugar = lugar.tipos_lugare.tipo_lugar
      lugar.tipoLugar = lugar.tipoLugar.toLowerCase()
      delete lugar.tipos_lugare;
      lugar.zona = null
    })
  }

  private parseLugaresWithDir() {
    this.direcciones.forEach(lugar => {
      let cadenas = lugar.localizacion.split(",");
      lugar.ciudad = cadenas.pop();
      let dir = cadenas.pop()
      lugar.altura = dir.split(" ").pop()
      let calleTemp: string[] = dir.split(" ")
      calleTemp.pop()
      let calle = ''
      calleTemp.forEach(value => {
        calle = calle + " " + value
      })
      lugar.calle = calle
      lugar.lat = lugar.punto.coordinates[0];
      lugar.lon = lugar.punto.coordinates[1];
      delete lugar.punto;
      delete lugar.id_tipo_lugar
      delete lugar.proyectos
      lugar.tInicio = lugar.validity[0].value
      lugar.tFinal = lugar.validity[1].value
      delete lugar.validity
      lugar.nombre = lugar.lugar
      delete lugar.lugar
      delete lugar.id
      lugar.zona = null
      delete lugar.localizacion
      lugar.tipoLugar = lugar.tipos_lugare.tipo_lugar
      lugar.tipoLugar = lugar.tipoLugar.toLowerCase()
      delete lugar.tipos_lugare;
    })
  }

  getMisProyectos(): void {
    this.proyectoService.byUser(this.currentUser.id, true).subscribe((dataPackage) => {
      this.misProyectos = dataPackage.data as Proyecto[];
    });
  }

  getLink(proyecto: Proyecto): void {
    if (proyecto.visibilidad == 'publico') {
      var aux = document.createElement("input");
      aux.setAttribute("value", window.location.href.split("?")[0].split("#")[0]);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand("copy");
      document.body.removeChild(aux);
      alert("URL copiada al portapapeles.\n\n" + window.location.href.split("?")[0].split("#")[0]);
    } else {
      alert("\nSi desea compartir su proyecto, por favor cambie la visibilidad a \"publico\".\n");
    }
  }

  addData(miProyecto: string) {

    if (this.lugaresCoordenadasMultipleAccionController.dataToCopy.length === 0
      && this.lugaresDireccionesMultipleAccionController.dataToCopy.length === 0
      && this.zonasMultipleAccionController.dataToCopy.length === 0
      && this.trayectosMultipleAccionController.dataToCopy.length === 0) {

      alert("\nSeleccione al menos un dato a copiar.");

    } else {

      const modalRef = this.modalService.open("Copiar", "¿Está seguro que desea copiar los datos seleccionados?", "").then(
        (_) => {
          this.seleccionandoCopiar = false;
          this.copyAllData(miProyecto)
          window.location.reload()
        },
        (_) => {
          this.seleccionandoCopiar = false;
        })
    }
  }

  deleteData() {

    if (this.lugaresCoordenadasMultipleAccionController.dataToDelete.length === 0
      && this.lugaresDireccionesMultipleAccionController.dataToDelete.length === 0
      && this.zonasMultipleAccionController.dataToDelete.length === 0
      && this.trayectosMultipleAccionController.dataToDelete.length === 0) {
        
      alert("\nSeleccione al menos un dato a eliminar.");

    } else {

      const modalRef = this.modalService.open("Eliminar", "¿Está seguro que desea dar de baja los datos seleccionados?", "Si lo hace, no podrá usarlos nuevamente.").then(
        (_) => {
          this.seleccionandoEliminar = false;
          this.deleteAllData()
          window.location.reload()
        },
        (_) => {
          this.seleccionandoEliminar = false;
        })
    }
  }

  copyAllData(aProyecto) {
    this.lugaresCoordenadasMultipleAccionController.copyData(this.lugarService, aProyecto);
    this.lugaresDireccionesMultipleAccionController.copyData(this.lugarService, aProyecto)
    this.zonasMultipleAccionController.copyData(this.zonaService, aProyecto)
    this.trayectosMultipleAccionController.copyData(this.trayectoService, aProyecto)
  }

  deleteAllData() {
    this.lugaresCoordenadasMultipleAccionController.deleteData(this.lugarService, this.proyecto.id);
    this.lugaresDireccionesMultipleAccionController.deleteData(this.lugarService, this.proyecto.id)
    this.zonasMultipleAccionController.deleteData(this.zonaService, this.proyecto.id)
    this.trayectosMultipleAccionController.deleteData(this.trayectoService, this.proyecto.id)
  }

  showError(message: string): void {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 4000 });
  }

  changeSize(aSize: number) {
    this.size = aSize;

    this.currentPageEsquema[ESQUEMA_1] = 1
    this.currentPageEsquema[ESQUEMA_2] = 1
    this.currentPageEsquema[ESQUEMA_3] = 1
    this.currentPageEsquema[ESQUEMA_4] = 1
    this.getLugaresCoordenadas();
    this.getLugaresDireccion();
    this.getZonas();
    this.getTrayectos();
  }


}
