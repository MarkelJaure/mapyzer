import {Injectable} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalNuevoLugarComponent} from './modal-nuevo-lugar/modal-nuevo-lugar.component';
import {ModalCsvPreviewComponent} from "./modal-csv-preview/modal-csv-preview.component";

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private service: NgbModal,
  ) {
  }

  nuevoLugar(proyectoId: string): void {
    const modal = this.service.open(ModalNuevoLugarComponent, {centered: true});
    modal.componentInstance.proyectoId = proyectoId;
  }

  openModalCsvPreview(fileSelected: File, esquemaSelected: string, proyectoId: string): void{
    const modal = this.service.open(ModalCsvPreviewComponent, {size: "xl", centered: true, scrollable: true})
    modal.componentInstance.numEsquema = esquemaSelected;
    modal.componentInstance.file = fileSelected;
    modal.componentInstance.proyectoId = proyectoId;
  }
}
