import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  //proyectoId: string;
  title: string;
  description: string;
  parrafo: string;


  constructor(public activeModal: NgbActiveModal ) {}
}
