import { Component, OnInit } from '@angular/core';
import { UploadFilesService } from "../services/upload-files.service";
import { HttpEventType } from "@angular/common/http";
import { AlertService } from "../_alert";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";

import * as Papa from "papaparse"
import { UsuarioService } from '../services/usuario.service';
import { ProyectoService } from '../services/proyecto.service';
import { Proyecto } from '../models/proyecto';
import * as XLSX from 'xlsx'
import { CryptoService } from '../services/crypto.service';

import { ValidadorDeColumnasFactory } from '../lib/ValidadorDeColumnasArchivo';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  esquemaNro: string;
  currentFile: File;
  progress = 0;
  message = '';
  proyectoId: string;
  result;

  private readonly columnasEsquema1 = Papa.unparse({
    data: ['codigo', 'nombre', 'descripcion', 'zona', 'tipoLugar', 'lat', 'lon', 'tInicio', 'tFinal']
  })

  private readonly columnasEsquema2 = Papa.unparse({
    data: ['codigo', 'nombre', 'descripcion', 'zona', 'tipoLugar', 'calle', 'altura', 'ciudad', 'tInicio', 'tFinal']
  })

  private readonly columnasEsquema3 = Papa.unparse({
    data: ['codigo', 'nombre', 'descripcion', 'tipoZona', 'tInicio', 'tFinal', 'coordenadas']
  })

  private readonly columnasEsquema4 = Papa.unparse({
    data: ['codigo', 'nombre', 'descripcion', 'tipoTrayecto', 'tInicio', 'tFinal', 'coordenadas']
  })

  optionsAlert = {
    autoClose: true,
    keepAfterRouteChange: false,
    id: "alert-1"
  };

  storeData;
  fileUploaded: File;
  worksheet;
  csvData: string;

  constructor(
    private readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly uploadService: UploadFilesService,
    public alertService: AlertService,
    private readonly router: Router,
    private readonly usuarioService: UsuarioService,
    private readonly proyectoService: ProyectoService,
    private readonly cryptoService: CryptoService
  ) {
  }

  ngOnInit(): void {
    this.proyectoId = this.cryptoService.decryptURL(this.route.snapshot.paramMap.get('idproyecto'));
    this.getProyecto()
  }

  upload(): void {
    this.progress = 0;

    this.uploadService.upload(this.currentFile, this.esquemaNro, this.proyectoId).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        }
      },
      err => {
        this.progress = 0;
        this.message = err.message;
        this.currentFile = undefined;
        this.alertService.error(this.message, this.optionsAlert)
      });
    this.alertService.success("Los datos del archivo se cargaron correctamente", this.optionsAlert)
  }

  selectFile(event) {

    if (event.target.files.item(0) !== null) {
      this.progress = 0;
      this.currentFile = event.target.files.item(0);
      document.getElementById('iF02').innerHTML = `${this.currentFile.name}`;
      if (this.currentFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        this.currentFile.type === 'application/vnd.ms-excel') {
        this.fileUploaded = event.target.files[0];
        this.readExcel();
      } else {
        Papa.parse(this.currentFile,
          {
            delimiter: ",",
            complete: (result, file) => {
              this.result = result.data;
            }
          })
      }
    } else if (this.currentFile === undefined) {
      document.getElementById('iF02').innerHTML = 'Seleccionar archivo';
    } else {
      this.alertService.error("No se ha seleccionado ningún archivo")
    }

  }

  readExcel() {
    const readFile = new FileReader();
    readFile.onload = (e) => {
      this.storeData = readFile.result;
      const data = new Uint8Array(this.storeData);
      const workbook = XLSX.read(data, { type: "array" });
      const first_sheet_name = workbook.SheetNames[0];
      this.worksheet = workbook.Sheets[first_sheet_name];
      this.csvData = XLSX.utils.sheet_to_csv(this.worksheet)

      Papa.parse(this.csvData,
        {
          delimiter: ",",
          complete: (result, file) => {
            this.result = result.data;
          }
        })
    }
    readFile.readAsArrayBuffer(this.fileUploaded);
  }


  getProyecto() {
    this.proyectoService.get(+this.proyectoId).subscribe((dataPackage) => {
      const proyecto = <Proyecto>dataPackage.data;
      if (!this.usuarioService.isCreatedByMe(proyecto)) { //Vuelve al Home si el usuario que intenta ingresar no es el creador
        this.router.navigate(['/']);
      }
    });
  }

  checkExtension() {
    if (this.esquemaNro === undefined) {
      this.alertService.error('Seleccione un esquema!', this.optionsAlert)
      return;
    }
    if (this.currentFile === undefined) {
      this.alertService.error('Seleccione un archivo!', this.optionsAlert)
      return;
    }

    if (this.currentFile.type !== 'text/csv' &&
      this.currentFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
      this.currentFile.type !== 'application/vnd.ms-excel') {
      this.alertService.error('Formato de archivo invalido!', this.optionsAlert)
      return;
    }
    this.openModalPreview()
  }

  setEsquema(nro: string): void {
    this.esquemaNro = nro
  }

  goBack() {
    this.location.back()
  }

  openModalPreview(): void {

    const validadorColumnas = ValidadorDeColumnasFactory.crearValidador(this.esquemaNro)
    validadorColumnas.setAlertService(this.alertService)
    validadorColumnas.setOptionsAlert(this.optionsAlert)
    validadorColumnas.setResult(this.result)

    try {

      validadorColumnas.validarColumnas()
      this.upload()
    } catch (error) {

      this.alertService.error("Error al seleccionar esquema. Seleccionelo nuevamente")
    }
  }

  descargarCSVesquema(nroEsquema: string) {
    const columnasEsquema = this.columnasDeEsquemaFactory(nroEsquema)
    this.downloadPlantillaCSV(nroEsquema, columnasEsquema)
  }

  descargarXLSesquema(nroEsquema: string) {
    const columnasEsquema = this.columnasDeEsquemaFactory(nroEsquema)
    this.downloadPlantillaXLS(nroEsquema, columnasEsquema)
  }

  downloadPlantillaCSV(nroEsquema: string, columnasEsquema) {
    const filename = 'plantilla_esquema_' + nroEsquema + '.csv'
    const blob = new Blob([columnasEsquema], { type: 'text/csv' });
    saveAs(blob, filename)
  }

  downloadPlantillaXLS(nroEsquema: string, columnasEsquema) {
    const filename = 'plantilla_esquema_' + nroEsquema + '.xls'
    const blob = new Blob([columnasEsquema], { type: 'application/vnd.ms-excel' });
    saveAs(blob, filename)
  }

  columnasDeEsquemaFactory(esquemaNro: string) {
    switch (esquemaNro) {
      case '1': return this.columnasEsquema1
      case '2': return this.columnasEsquema2
      case '3': return this.columnasEsquema3
      case '4': return this.columnasEsquema4
      default: return this.alertService.error("Error al seleccionar esquema. Seleccionelo nuevamente")
    }
  }

}