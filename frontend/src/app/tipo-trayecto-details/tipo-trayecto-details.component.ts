import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { TipoTrayecto } from '../models/tipoTrayecto';
import { TipoTrayectoService } from '../services/tipo-trayecto.service';
import { ToastService } from '../services/toast.service';
import { UsuarioService } from '../services/usuario.service';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-tipo-trayecto-details',
  templateUrl: './tipo-trayecto-details.component.html',
  styleUrls: ['./tipo-trayecto-details.component.css']
})
export class TipoTrayectoDetailsComponent implements OnInit {

  tipo_trayecto: TipoTrayecto;
  searching: boolean = false;
  searchFailed: boolean = false;
  createForm: FormGroup;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private tipoTrayectoService: TipoTrayectoService,
    private location: Location,
    public toastService: ToastService,
    private usuarioService: UsuarioService,
    private router: Router,
    private cryptoService: CryptoService,
  ) {
    if (!this.usuarioService.isAdmin()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.get();

    this.createForm = new FormGroup({
      nombreTipoTrayectoVal: new FormControl('', [Validators.required, Validators.maxLength(60), Validators.pattern('[a-z0-9. ]*')]),
      clasificadorVal: new FormControl('', [Validators.maxLength(60)]),
      lineaVal: new FormControl('', [Validators.maxLength(6), Validators.pattern('[0-9]')]),
      tipoLineaVal: new FormControl('', [Validators.maxLength(6), Validators.pattern('[0-9]+,[0-9]+')]),
      colorVal: new FormControl(''),
      descripcionVal: new FormControl('', [Validators.maxLength(60)]),
      observacionesVal: new FormControl(''),
    });
  }

  get(): void {
    const id = this.cryptoService.decryptURL(this.route.snapshot.paramMap.get('id'));
    if (id === 'new') {
      this.tipo_trayecto = {
        id: null,
        tipo_trayecto: null,
        clasificador: null,
        linea: null,
        tipo_linea: null,
        color: null,
        descripcion: null,
        observaciones: null,
      }
    } else {
      this.tipoTrayectoService.get(+id).subscribe((dataPackage) => {
        this.tipo_trayecto = <TipoTrayecto>dataPackage.data;
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {

    this.tipoTrayectoService.save(this.tipo_trayecto)
      .subscribe(dataPackage => {
        this.tipo_trayecto = (dataPackage.data as TipoTrayecto);
        this.goBack();
      }, res => {
        this.showError(res.error.message);
      });
  }

  onSubmit(): void {
    if (this.createForm.value.colorVal == "1")
      this.tipo_trayecto.color = "blue";
    if (this.createForm.value.colorVal == "2")
      this.tipo_trayecto.color = "gold";
    if (this.createForm.value.colorVal == "3")
      this.tipo_trayecto.color = "red";
    if (this.createForm.value.colorVal == "4")
      this.tipo_trayecto.color = "green";
    if (this.createForm.value.colorVal == "5")
      this.tipo_trayecto.color = "orange";
    if (this.createForm.value.colorVal == "6")
      this.tipo_trayecto.color = "yellow";
    if (this.createForm.value.colorVal == "7")
      this.tipo_trayecto.color = "violet";
    if (this.createForm.value.colorVal == "8")
      this.tipo_trayecto.color = "grey";
    if (this.createForm.value.colorVal == "9")
      this.tipo_trayecto.color = "black";
    if (this.createForm.value.colorVal == "10")
      this.tipo_trayecto.color = "brown";

    this.submitted = true;

    // stop here if form is invalid
    if (this.createForm.invalid) {
      return;
    }

    this.save();
  }

  showSuccess(message: string): void {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 4000 });
  }

  showError(message: string): void {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 4000 });
  }
}
