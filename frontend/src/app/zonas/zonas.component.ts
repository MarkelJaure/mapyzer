import { Component, OnInit } from '@angular/core';

import { Zona } from '../models/zona';
import { ZonaService } from '../services/zona.service';
import { ResultsPage } from '../models/results-page';
import { ParseadorDeFecha } from '../lib/ParseadorDeFecha';

@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.component.html',
  styleUrls: ['./zonas.component.css']
})
export class ZonasComponent implements OnInit {

  zonas: Zona[];
  pages: number[];
  resultsPage: ResultsPage = {} as ResultsPage;
  currentPage = 1;
  size = 10
  zona: String = "";
  fecha: String = "";

  constructor(
    private zonaService: ZonaService,
  ) { }

  ngOnInit(): void {
    this.getZonas();
  }

  getZonas(): void {
    if (this.zona == undefined) {
      this.zona = "";
    }
    if (this.fecha == undefined) {
      this.fecha = "";
    }
    this.zonaService.byPage(this.currentPage, this.size,this.zona,this.fecha).subscribe((dataPackage) => {
      this.resultsPage = (dataPackage.data as ResultsPage);
      this.pages = Array.from(Array(this.resultsPage.last).keys());
      for (let zona of this.resultsPage.results) {
        var theZona = <Zona>zona;
        theZona.validity = ParseadorDeFecha.parsearFecha(theZona.validity)
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
    this.getZonas();
  }


}
