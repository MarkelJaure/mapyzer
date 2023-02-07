import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Usuario } from '../models/usuario';
import { Proyecto } from '../models/proyecto';
import { ProyectoService } from '../services/proyecto.service';
import { Lugar } from '../models/lugar';
import { Zona } from '../models/zona';
import { ToastService } from '../services/toast.service';
import { Trayecto } from '../models/trayecto';
import { UsuarioService } from '../services/usuario.service';
import { CryptoService } from '../services/crypto.service';
import { ModalService } from "../services/modal.service";


@Component({
  selector: 'app-proyecto-details',
  templateUrl: './proyecto-details.component.html',
  styleUrls: ['./proyecto-details.component.css']
})
export class ProyectoDetailsComponent implements OnInit {

  proyecto: Proyecto;
  timegen: Date;
  searching: boolean = false;
  searchFailed: boolean = false;
  createForm: FormGroup;
  submitted = false;
  currentUser: Usuario;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly proyectoService: ProyectoService,
    private readonly location: Location,
    public toastService: ToastService,
    private readonly usuarioService: UsuarioService,
    private readonly router: Router,
    public cryptoService: CryptoService,
    private modalService: ModalService,
  ) {

    this.usuarioService.currentUser.subscribe(x => this.currentUser = x);
    if (!this.usuarioService.isUser()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.get();

    this.createForm = new FormGroup({
      nombreProyectoVal: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      descripcionVal: new FormControl('', [Validators.maxLength(60)]),
      observacionesVal: new FormControl('', [Validators.maxLength(100)]),
      visibilidadVal: new FormControl('publico'),
    });
  }

  get(): void {
    const id = this.cryptoService.decryptURL(this.route.snapshot.paramMap.get('id'));
    if (id === 'new') {
      this.proyecto = {
        id: null,
        proyecto: null,
        usuario: <Usuario>this.currentUser,
        descripcion: null,
        observaciones: null,
        timegen: new Date(),
        visibilidad: null,
        lugares: <Lugar[]>[],
        zonas: <Zona[]>[],
        trayectos: <Trayecto[]>[],
        isvalid: true,
      };
      this.timegen = new Date(this.proyecto.timegen.getFullYear(),
        this.proyecto.timegen.getMonth(),
        this.proyecto.timegen.getDate(),
        this.proyecto.timegen.getHours(),
        this.proyecto.timegen.getMinutes(),
        this.proyecto.timegen.getSeconds());

    } else {
      this.proyectoService.get(+id).subscribe((dataPackage) => {
        this.proyecto = <Proyecto>dataPackage.data;
        this.timegen = this.proyecto.timegen;
        this.createForm.controls.visibilidadVal = new FormControl(this.proyecto.visibilidad)

        if (this.currentUser.id !== this.proyecto.usuario.id) { //Vuelve al Login si el usuario que intenta ingresar no es el creador
          this.router.navigate(['/login']);
        }

      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {

    this.proyectoService.save(this.proyecto)
      .subscribe(dataPackage => {
        this.proyecto = (dataPackage.data as Proyecto);
        this.goBack();
      }, res => {
        this.showError(res.error.message);
      });
  }

  onSubmit(): void {
    this.proyecto.visibilidad = this.createForm.controls.visibilidadVal.value;

    this.submitted = true;

    // stop here if form is invalid
    if (this.createForm.invalid) {
      return;
    }

    this.save();
  }

  eliminarProyecto(): void {
    const modalRef = this.modalService.open("Eliminar", "¿Está seguro que desea dar de baja este proyecto?", "Si lo hace, no podrá usarlo nuevamente.").then(
      (_) => {
        this.proyectoService.removeProyecto(this.proyecto.id).subscribe(() => {
          this.goBack()
        });
      },
      (_) => {
      }
    );
  }

  showSuccess(message: string): void {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 4000 });
  }

  showError(message: string): void {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 4000 });
  }


}
