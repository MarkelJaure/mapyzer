import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-modal-nuevo-lugar',
  templateUrl: './modal-nuevo-lugar.component.html',
  styleUrls: ['./modal-nuevo-lugar.component.css']
})
export class ModalNuevoLugarComponent {

  proyectoId: string;
  newEncriptado;

  constructor(
    public activeModal: NgbActiveModal,
    private cryptoService: CryptoService
    ) {
      this.newEncriptado = this.cryptoService.encryptURL('new')
     }
}
