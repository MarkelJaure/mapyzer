import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { TipoZona } from '../models/tipoZona';
import { TipoZonaService } from '../services/tipo-zona.service';
import { ToastService } from '../services/toast.service';
import { UsuarioService } from '../services/usuario.service';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-tipo-zona-details',
  templateUrl: './tipo-zona-details.component.html',
  styleUrls: ['./tipo-zona-details.component.css']
})
export class TipoZonaDetailsComponent implements OnInit {

  tipo_zona: TipoZona;
  searching: boolean = false;
  searchFailed: boolean = false;
  createForm: FormGroup;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private tipoZonaService: TipoZonaService,
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
      nombreTipoZonaVal: new FormControl('', [Validators.required, Validators.maxLength(60), Validators.pattern('[a-z0-9. ]*')]),
      tipoLineaVal: new FormControl('', [Validators.maxLength(6), Validators.pattern('[0-9]+,[0-9]+')]),
      colorVal: new FormControl(''),
      color_rellenoVal: new FormControl(''),
      descripcionVal: new FormControl('', [Validators.maxLength(60)]),
    });
  }

  get(): void {
    const id = this.cryptoService.decryptURL(this.route.snapshot.paramMap.get('id'));
    if (id === 'new') {
      this.tipo_zona = {
        id: null,
        tipo_zona: null,
        tipo_linea: null,
        color: null,
        color_relleno: null,
        descripcion: null,
      }
    }
    else {
      this.tipoZonaService.get(+id).subscribe((dataPackage) => {
        this.tipo_zona = <TipoZona>dataPackage.data;
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {

    this.tipoZonaService.save(this.tipo_zona)
      .subscribe(dataPackage => {
        this.tipo_zona = (dataPackage.data as TipoZona);
        this.goBack();
      }, res => {
        this.showError(res.error.message);
      });
  }

  onSubmit(): void {
    if (this.createForm.value.colorVal == "1")
      this.tipo_zona.color = "blue";
    if (this.createForm.value.colorVal == "2")
      this.tipo_zona.color = "gold";
    if (this.createForm.value.colorVal == "3")
      this.tipo_zona.color = "red";
    if (this.createForm.value.colorVal == "4")
      this.tipo_zona.color = "green";
    if (this.createForm.value.colorVal == "5")
      this.tipo_zona.color = "orange";
    if (this.createForm.value.colorVal == "6")
      this.tipo_zona.color = "yellow";
    if (this.createForm.value.colorVal == "7")
      this.tipo_zona.color = "violet";
    if (this.createForm.value.colorVal == "8")
      this.tipo_zona.color = "grey";
    if (this.createForm.value.colorVal == "9")
      this.tipo_zona.color = "black";
      if (this.createForm.value.colorVal == "10")
      this.tipo_zona.color = "brown";

    if (this.createForm.value.color_rellenoVal == "1")
      this.tipo_zona.color_relleno = "blue";
    if (this.createForm.value.color_rellenoVal == "2")
      this.tipo_zona.color_relleno = "gold";
    if (this.createForm.value.color_rellenoVal == "3")
      this.tipo_zona.color_relleno = "red";
    if (this.createForm.value.color_rellenoVal == "4")
      this.tipo_zona.color_relleno = "green";
    if (this.createForm.value.color_rellenoVal == "5")
      this.tipo_zona.color_relleno = "orange";
    if (this.createForm.value.color_rellenoVal == "6")
      this.tipo_zona.color_relleno = "yellow";
    if (this.createForm.value.color_rellenoVal == "7")
      this.tipo_zona.color_relleno = "violet";
    if (this.createForm.value.color_rellenoVal == "8")
      this.tipo_zona.color_relleno = "grey";
    if (this.createForm.value.color_rellenoVal == "9")
      this.tipo_zona.color_relleno = "black";
      if (this.createForm.value.color_rellenoVal == "10")
      this.tipo_zona.color_relleno = "brown";

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
