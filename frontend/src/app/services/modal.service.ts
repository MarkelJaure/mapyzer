import { Injectable } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalNuevoLugarComponent } from '../modal-nuevo-lugar/modal-nuevo-lugar.component';
import { ModalComponent } from '../modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private service: NgbModal,
  ) {
  }

  nuevoLugar(proyectoId: string): void {
    const modal = this.service.open(ModalNuevoLugarComponent, { centered: true });
    modal.componentInstance.proyectoId = proyectoId;
    // return modal.result;
  }

  confirm(proyectoId: string): Promise<any> {
    const modal = this.service.open(ModalComponent);
    modal.componentInstance.proyectoId = proyectoId;
    return modal.result;
  }

  open(title: string, description: string, parrafo: string): Promise<any> {
    const modal = this.service.open(ModalComponent);
    modal.componentInstance.title = title;
    modal.componentInstance.parrafo = parrafo;
    modal.componentInstance.description = description;
    return modal.result;
  }

}
