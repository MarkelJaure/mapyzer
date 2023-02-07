import { Component, OnInit } from '@angular/core';

import { Lugar } from '../models/lugar';
import { LugarService } from '../services/lugar.service';
import { ResultsPage } from '../models/results-page';
import { Pertenece } from '../models/pertenece';
import { ParseadorDeFecha } from '../lib/ParseadorDeFecha';

@Component({
  selector: 'app-lugares',
  templateUrl: './lugares.component.html',
  styleUrls: ['./lugares.component.css']
})
export class LugaresComponent implements OnInit {

  lugares: Lugar[];
  lugar: string = "";
  fecha: string = undefined;
  allowValidityNull: boolean = true;
  pages: number[];
  resultsPage: ResultsPage = {} as ResultsPage;
  currentPage = 1;
  size =10;
  pertenece: Pertenece[];


  constructor(
    private lugarService: LugarService,
  ) {
  }

  ngOnInit(): void {
    this.getLugares();
  }

  getPertenece(): Pertenece[] {
    this.lugarService.getPertenece().subscribe((dataPackage) => {
      this.pertenece = dataPackage.data as Pertenece[];
    });
    return this.pertenece;
  }

  getLugares(): void {
    if (this.lugar == undefined) {
      this.lugar = "";
    }
    if (this.fecha == undefined) {
      this.fecha = "";
    }
    this.lugarService.byPage(this.currentPage, this.size, this.lugar, this.fecha).subscribe((dataPackage) => {
      this.resultsPage = (dataPackage.data as ResultsPage);
      this.pages = Array.from(Array(this.resultsPage.last).keys());
      for (let lugar of this.resultsPage.results) {
        var theLugar = <Lugar>lugar;
        theLugar.validity = ParseadorDeFecha.parsearFecha(theLugar.validity)
      }
    });
  }


  showPage(pageId: number): void {
    if (!this.currentPage) {
      this.currentPage = 1;
    }
    let page = pageId;
    if (pageId === -2) { // First
      page = 1;
    }
    if (pageId === -1) { // Previous
      page = this.currentPage > 1 ? this.currentPage - 1 : this.currentPage;
    }
    if (pageId === -3) { // Next
      page = this.currentPage < this.resultsPage.last ? this.currentPage + 1 : this.currentPage;
    }
    if (pageId === -4) { // Last
      page = this.resultsPage.last;
    }
    if (pageId > 1 && this.pages.length >= pageId) { // Number
      page = this.pages[pageId - 1] + 1;
    }
    this.currentPage = page;
    this.getLugares();
  }


}
