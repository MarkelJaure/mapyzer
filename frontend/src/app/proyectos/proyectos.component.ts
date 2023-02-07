import { Component, OnInit } from '@angular/core';

import { Proyecto } from '../models/proyecto';
import { ProyectoService } from '../services/proyecto.service';
import { ResultsPage } from '../models/results-page';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { CryptoService } from '../services/crypto.service'; 
@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {

  proyectos: Proyecto[]
  pagesMisProyectos: number[];
  pagesProyectosPublicos: number[];
  resultsPageMisProyectos: ResultsPage = <ResultsPage>{};
  resultsPageProyectosPublicos: ResultsPage = {} as ResultsPage;
  currentPageMisProyectos: number = 1;
  currentPageProyectosPublicos: number = 1;
  size: number = 10
  currentUser: Usuario;
  seleccionando: boolean = false;
  seleccionados: number[] = new Array();
  error = "";

  newEncriptado;
  idsPrivadosEncriptados = new Array()
  idsPublicosEncriptados = new Array()

  constructor(
    private proyectoService: ProyectoService,
    public usuarioService: UsuarioService,
    private router: Router,
    public cryptoService: CryptoService
  ) {
    this.usuarioService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.newEncriptado = this.cryptoService.encryptURL('new')
    if (this.currentUser) {
      this.getMisProyectos();
    }
    this.getProyectosPublicos();
  }

  getMisProyectos(): void {
    this.proyectoService.byUserByPage(this.currentPageMisProyectos, this.size, this.currentUser.id,true).subscribe((dataPackage) => {
      this.idsPrivadosEncriptados = new Array()
      this.resultsPageMisProyectos = <ResultsPage>dataPackage.data;
      this.pagesMisProyectos = Array.from(Array(this.resultsPageMisProyectos.last).keys());
      for (let proyecto of this.resultsPageMisProyectos.results) {
        var proy = <Proyecto>proyecto;
        proy.timegen = new Date(proy.timegen)
        this.idsPrivadosEncriptados.push(this.cryptoService.encryptURL("" + proy.id));
        proyecto = proy;
      }
    });
  }

  getProyectosPublicos() {
    this.proyectoService.byPage(this.currentPageProyectosPublicos, this.size,true).subscribe((dataPackage) => {
      this.idsPublicosEncriptados = new Array()
      this.resultsPageProyectosPublicos = <ResultsPage>dataPackage.data;
      this.pagesProyectosPublicos = Array.from(Array(this.resultsPageProyectosPublicos.last).keys());
      for (let proyecto of this.resultsPageProyectosPublicos.results) {
        var proy = <Proyecto>proyecto;
        proy.timegen = new Date(proy.timegen);
        this.idsPublicosEncriptados.push(this.cryptoService.encryptURL("" + proy.id))
        proyecto = proy
      }
    });
  }

  showPageMisProyectos(pageId: number): void {
    if (!this.currentPageMisProyectos) {
      this.currentPageMisProyectos = 1;
    }
    let page = pageId;
    if (pageId == -2) { // First
      page = 1;
    }
    if (pageId == -1) { // Previous
      page = this.currentPageMisProyectos > 1 ? this.currentPageMisProyectos - 1 : this.currentPageMisProyectos;
    }
    if (pageId == -3) { // Next
      page = this.currentPageMisProyectos < this.resultsPageMisProyectos.last ? this.currentPageMisProyectos + 1 : this.currentPageMisProyectos;
    }
    if (pageId == -4) { // Last
      page = this.resultsPageMisProyectos.last;
    }
    if (pageId > 1 && this.pagesMisProyectos.length >= pageId) { // Number
      page = this.pagesMisProyectos[pageId - 1] + 1;
    }
    this.currentPageMisProyectos = page;
    this.getMisProyectos();
  };

  showPageProyectosPublicos(pageId: number): void {
    if (!this.currentPageProyectosPublicos) {
      this.currentPageProyectosPublicos = 1;
    }
    let page = pageId;
    if (pageId == -2) { // First
      page = 1;
    }
    if (pageId == -1) { // Previous
      page = this.currentPageProyectosPublicos > 1 ? this.currentPageProyectosPublicos - 1 : this.currentPageProyectosPublicos;
    }
    if (pageId == -3) { // Next
      page = this.currentPageProyectosPublicos < this.resultsPageProyectosPublicos.last ? this.currentPageProyectosPublicos + 1 : this.currentPageProyectosPublicos;
    }
    if (pageId == -4) { // Last
      page = this.resultsPageProyectosPublicos.last;
    }
    if (pageId > 1 && this.pagesProyectosPublicos.length >= pageId) { // Number
      page = this.pagesProyectosPublicos[pageId - 1] + 1;
    }
    this.currentPageProyectosPublicos = page;
    this.getProyectosPublicos();
  };

  toggleSeleccionado(id: number) {
    this.seleccionados.indexOf(id) > -1 ? this.seleccionados.splice(this.seleccionados.indexOf(id), 1): this.seleccionados.push(id) //toggle checkbox
  }

  SeleccionadosContains(id: number) {
    return (this.seleccionados.indexOf(id) > -1)
  }

  goToMapProyectos() {
    if (this.seleccionados.length > 0) {
      this.proyectoService.updateProyectosAVisualizar(this.seleccionados)
      this.seleccionados.sort()
      this.router.navigate(['../mapProyectos']);

    }
    else {
      this.error = "Seleccione al menos 1 proyecto a visualizar"
    }
  }

  changeSize(aSize: number){
    this.size = aSize;
    this.currentPageMisProyectos = 1
    this.currentPageProyectosPublicos = 1
    this.getMisProyectos();
    this.getProyectosPublicos();
  }


}