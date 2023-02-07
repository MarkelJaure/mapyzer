import {Component, OnInit, AfterViewInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import * as Papa from "papaparse"
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {UploadFilesService} from "../services/upload-files.service";

@Component({
  selector: 'app-modal-csv-preview',
  templateUrl: './modal-csv-preview.component.html',
  styleUrls: ['./modal-csv-preview.component.css']
})
export class ModalCsvPreviewComponent implements OnInit {

  numEsquema: string;
  proyectoId: string;
  file: File;
  result: any;
  keys;
  progress = 0;
  message = '';

  constructor(
    public activeModal: NgbActiveModal,
    private uploadService: UploadFilesService
  ) {
  }

  ngOnInit(): void {
    Papa.parse(this.file,
      {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
        complete: (result, file) => {
          this.result = result.data;
          this.keys = Object.keys(this.result[0]); // Get the column names
          if (this.numEsquema === '3'){
            this.result.forEach( value => {
              this.result.coordenadas = JSON.parse(value.coordenadas)
            })
          }
        }
      })
  }


  upload(): void {
    this.progress = 0;

    this.uploadService.createDirecciones(this.result, this.proyectoId).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.activeModal.close(this.message)
        }
      },
      err => {
        this.progress = 0;
        this.message = err.message;
        this.activeModal.close(this.message)
        // this.alertService.error(this.message, this.optionsAlert1)
      });

  }
}
