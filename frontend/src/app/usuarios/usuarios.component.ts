import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResultsPage } from '../models/results-page';
import { Role } from '../models/role';
import { Usuario } from '../models/usuario';
import { CryptoService } from '../services/crypto.service';
import { ModalService } from '../services/modal.service';
import { UsuarioService } from '../services/usuario.service';

const ADMINISTRADOR = 0
const USUARIO = 1
const INVITADO = 2

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  pagesRol: number[][] = new Array();
  resultsPageRol: ResultsPage[] = new Array() as ResultsPage[];
  currentPageRol: number[] = [1, 1, 1, 1];
  size = 10;
  searching = false;
  searchFailed = false;

  idAdminEncriptados  = new Array()
  idUsuariosEncriptados = new Array()
  idInvitadosEncriptados = new Array()

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private modalService: ModalService,
    private cryptoService: CryptoService,
  ) {
    if (!usuarioService.isAdmin()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.getAdministradores()
    this.getUsuarios()
    this.getInvitados()
  }

  getAdministradores(): void {
    //this.formatFilter()
    this.idAdminEncriptados = new Array()
    this.usuarioService.byPage(this.currentPageRol[ADMINISTRADOR], this.size, Role.Administrador).subscribe((dataPackage) => {
      this.resultsPageRol[ADMINISTRADOR] = (dataPackage.data) as ResultsPage;
      this.pagesRol[ADMINISTRADOR] = Array.from(Array(this.resultsPageRol[ADMINISTRADOR].last).keys());
      for (let nombre of this.resultsPageRol[ADMINISTRADOR].results) {
        var theUsuario = <Usuario>nombre
        this.idAdminEncriptados.push(this.cryptoService.encryptURL('' + theUsuario.id))
      }
    });
  }

  getUsuarios(): void {
    //this.formatFilter()
    this.idUsuariosEncriptados = new Array()
    this.usuarioService.byPage(this.currentPageRol[USUARIO], this.size, Role.Usuario).subscribe((dataPackage) => {
      this.resultsPageRol[USUARIO] = (dataPackage.data) as ResultsPage;
      this.pagesRol[USUARIO] = Array.from(Array(this.resultsPageRol[USUARIO].last).keys());
      for (let nombre of this.resultsPageRol[USUARIO].results) {
        var theUsuario = <Usuario>nombre
        this.idUsuariosEncriptados.push(this.cryptoService.encryptURL('' + theUsuario.id))
      }
    });
  }

  getInvitados(): void {
    //this.formatFilter()
    this.idInvitadosEncriptados = new Array()
    this.usuarioService.byPage(this.currentPageRol[INVITADO], this.size, Role.Invitado).subscribe((dataPackage) => {
      this.resultsPageRol[INVITADO] = (dataPackage.data) as ResultsPage;
      this.pagesRol[INVITADO] = Array.from(Array(this.resultsPageRol[INVITADO].last).keys());
      for (let nombre of this.resultsPageRol[INVITADO].results) {
        var theUsuario = <Usuario>nombre
        this.idInvitadosEncriptados.push(this.cryptoService.encryptURL('' + theUsuario.id))
      }
    });
  }

  showPageRol(pageId: number, rol: number): void {

    if (!this.currentPageRol[rol]) {
      this.currentPageRol[rol] = 1;
    }

    let page = pageId;
    if (pageId === -2) { // First
      page = 1;
    }
    if (pageId === -1) { // Previous
      page = this.currentPageRol[rol] > 1 ? this.currentPageRol[rol] - 1 : this.currentPageRol[rol];
    }
    if (pageId === -3) { // Next
      page = this.currentPageRol[rol] < this.resultsPageRol[rol].last ? this.currentPageRol[rol] + 1 : this.currentPageRol[rol];
    }
    if (pageId === -4) { // Last
      page = this.resultsPageRol[rol].last;
    }
    if (pageId > 1 && this.pagesRol[rol].length >= pageId) { // Number
      page = this.pagesRol[rol][pageId - 1] + 1;
    }
    this.currentPageRol[rol] = page;

    switch (rol) {
      case 0: this.getAdministradores(); break;
      case 1: this.getUsuarios(); break;
      case 2: this.getInvitados(); break;
      default: break;
    }
  }

  changeToAdmin(id) {

    const modal = this.modalService.open("Ascender a ADMINISTRADOR","Esta seguro de que desea darle rol de ADMINISTRADOR a este usuario?","Este cambio no es reversible");
    const that = this;
    modal.then(
      function () {
        that.usuarioService.updateRol(id, Role.Administrador).subscribe(() => {
          that.getUsuarios();
          that.getAdministradores();
        });
      },
      function () { 
      }
    );
  }

  changeToUser(id) {

    const modal = this.modalService.open("Ascender a DUEÑO DE DATOS","Esta seguro de que desea darle rol de DUEÑO DE DATOS a este usuario?","Este cambio no es reversible");
    const that = this;
    modal.then(
      function () {
        that.usuarioService.updateRol(id, Role.Usuario).subscribe(() => {
          that.getUsuarios();
          that.getInvitados();
        });
      },
      function () { 
      }
    );
  }

  changeSize(aSize: number){
    this.size = aSize;
    this.currentPageRol[ADMINISTRADOR] = 1
    this.currentPageRol[USUARIO] = 1
    this.currentPageRol[INVITADO] = 1
    this.getAdministradores();
    this.getUsuarios();
    this.getInvitados();
  }

}
