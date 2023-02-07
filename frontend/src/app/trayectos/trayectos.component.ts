import { Component, OnInit } from '@angular/core';

import { Trayecto } from '../models/trayecto';
import { TrayectoService } from '../services/trayecto.service';
import { ResultsPage } from '../models/results-page';
import { ParseadorDeFecha } from '../lib/ParseadorDeFecha';

@Component({
  selector: 'app-trayectos',
  templateUrl: './trayectos.component.html',
  styleUrls: ['./trayectos.component.css']
})
export class TrayectosComponent implements OnInit {

  trayectos: Trayecto[];
  pages: number[];
  resultsPage: ResultsPage = {} as ResultsPage;
  currentPage = 1;
  size = 10
  trayecto: String = "";
  fecha: String = "";

  constructor(
    private trayectoService: TrayectoService,
  ) { }

  ngOnInit(): void {
    this.getTrayectos();
  }

  getTrayectos(): void {
    if (this.trayecto == undefined) {
      this.trayecto = "";
    }
    if (this.fecha == undefined) {
      this.fecha = "";
    }
    this.trayectoService.byPage(this.currentPage, this.size,this.trayecto,this.fecha).subscribe((dataPackage) => {
      this.resultsPage = (dataPackage.data as ResultsPage);
      this.pages = Array.from(Array(this.resultsPage.last).keys());
      for (let trayecto of this.resultsPage.results) {
        var thetrayecto = <Trayecto>trayecto;
        thetrayecto.validity = ParseadorDeFecha.parsearFecha(thetrayecto.validity)
      }
    });
  }

  showPage(pageId: number): void {
    if (!this.currentPage){
      this.currentPage = 1;
    }
    let page = pageId;
    if (pageId == -2) { // First
      page = 1;
    }
    if (pageId == -1) { // Previous
      page = this.currentPage > 1 ? this.currentPage - 1 : this.currentPage;
    }
    if (pageId == -3) { // Next
      page = this.currentPage < this.resultsPage.last ? this.currentPage + 1 : this.currentPage;
    }
    if (pageId == -4) { // Last
      page = this.resultsPage.last;
    }
    if (pageId > 1 && this.pages.length >= pageId) { // Number
      page = this.pages[pageId - 1] + 1;
    }
    this.currentPage = page;
    this.getTrayectos();
  }


}
