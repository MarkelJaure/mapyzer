import { Component, ContentChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { TipoLugar } from '../models/tipoLugar';
import { TipoLugarService } from '../services/tipo-lugar.service';
import { ToastService } from '../services/toast.service';
import { UsuarioService } from '../services/usuario.service';
import { CryptoService } from '../services/crypto.service';


@Component({
  selector: 'app-tipo-lugar-details',
  templateUrl: './tipo-lugar-details.component.html',
  styleUrls: ['./tipo-lugar-details.component.css']
})
export class TipoLugarDetailsComponent implements OnInit {

  tipo_lugar: TipoLugar;
  searching: boolean = false;
  searchFailed: boolean = false;
  createForm: FormGroup;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private tipoLugarService: TipoLugarService,
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
      nombreTipoLugarVal: new FormControl('', [Validators.required, Validators.maxLength(60), Validators.pattern('[a-z0-9. ]*')]),
      clasificadorVal: new FormControl('', [Validators.maxLength(60)]),
      tipoMarcadorVal: new FormControl(''),
      iconoVal: new FormControl(''),
      tamañoVal: new FormControl('', [Validators.maxLength(6), Validators.min(20), Validators.max(50), Validators.pattern('[0-9]*')]),
      colorVal: new FormControl(''),
      descripcionVal: new FormControl('', [Validators.maxLength(60)]),
      observacionesVal: new FormControl(''),
    });
  }

  get(): void {
    const id = this.cryptoService.decryptURL(this.route.snapshot.paramMap.get('id'));
    if (id === 'new') {
      this.tipo_lugar = {
        id: null,
        tipo_lugar: null,
        clasificador: null,
        tipo_marcador: null,
        icono: null,
        size: null,
        color: null,
        descripcion: null,
      }
    } else {
      this.tipoLugarService.get(+id).subscribe((dataPackage) => {
        this.tipo_lugar = <TipoLugar>dataPackage.data;
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {

    this.tipoLugarService.save(this.tipo_lugar)
      .subscribe(dataPackage => {
        this.tipo_lugar = (dataPackage.data as TipoLugar);
        this.goBack();
      }, res => {
        this.showError(res.error.message);
      });
  }

  onSubmit(): void {

    // CONDICIONES PARA EL TIPO DE MARCADOR
    if (this.createForm.value.tipoMarcadorVal == "1" || null)
      this.tipo_lugar.tipo_marcador = null;
    if (this.createForm.value.tipoMarcadorVal == "2")
      this.tipo_lugar.tipo_marcador = "star";
    if (this.createForm.value.tipoMarcadorVal == "3")
      this.tipo_lugar.tipo_marcador = "diamond";
    if (this.createForm.value.tipoMarcadorVal == "4")
      this.tipo_lugar.tipo_marcador = "square";

    //CONDICIONES PARA EL TIPO DE ICONO
    if (this.createForm.value.iconoVal == "0" || null)
      this.tipo_lugar.icono = null;
    if (this.createForm.value.iconoVal == "1")
      this.tipo_lugar.icono = "airport";
    if (this.createForm.value.iconoVal == "2")
      this.tipo_lugar.icono = "bank";
    if (this.createForm.value.iconoVal == "3")
      this.tipo_lugar.icono = "home";
    if (this.createForm.value.iconoVal == "4")
      this.tipo_lugar.icono = "educative";
    if (this.createForm.value.iconoVal == "5")
      this.tipo_lugar.icono = "gym";
    if (this.createForm.value.iconoVal == "6")
      this.tipo_lugar.icono = "goberment";
    if (this.createForm.value.iconoVal == "7")
      this.tipo_lugar.icono = "hospital";
    if (this.createForm.value.iconoVal == "8")
      this.tipo_lugar.icono = "hotel";
    if (this.createForm.value.iconoVal == "9")
      this.tipo_lugar.icono = "church";
    if (this.createForm.value.iconoVal == "10")
      this.tipo_lugar.icono = "office";
    if (this.createForm.value.iconoVal == "11")
      this.tipo_lugar.icono = "shipport";
    if (this.createForm.value.iconoVal == "12")
      this.tipo_lugar.icono = "rest";
    if (this.createForm.value.iconoVal == "13")
      this.tipo_lugar.icono = "restaurante";
    if (this.createForm.value.iconoVal == "14")
      this.tipo_lugar.icono = "market";

    //CONDICIONES PARA EL COLOR
    if (this.createForm.value.colorVal == "0" || null)
      this.tipo_lugar.color = null;
    if (this.createForm.value.colorVal == "1")
      this.tipo_lugar.color = "yellow";
    if (this.createForm.value.colorVal == "2")
      this.tipo_lugar.color = "blue";
    if (this.createForm.value.colorVal == "3")
      this.tipo_lugar.color = "darkblue";
    if (this.createForm.value.colorVal == "4")
      this.tipo_lugar.color = "white";
    if (this.createForm.value.colorVal == "5")
      this.tipo_lugar.color = "lightblue";
    if (this.createForm.value.colorVal == "6")
      this.tipo_lugar.color = "orange";
    if (this.createForm.value.colorVal == "7")
      this.tipo_lugar.color = "black";
    if (this.createForm.value.colorVal == "8")
      this.tipo_lugar.color = "red";
    if (this.createForm.value.colorVal == "9")
      this.tipo_lugar.color = "darkred";
    if (this.createForm.value.colorVal == "10")
      this.tipo_lugar.color = "pink";
    if (this.createForm.value.colorVal == "11")
      this.tipo_lugar.color = "darkpink";
    if (this.createForm.value.colorVal == "12")
      this.tipo_lugar.color = "green";
    if (this.createForm.value.colorVal == "13")
      this.tipo_lugar.color = "lightgreen";
    if (this.createForm.value.colorVal == "14")
      this.tipo_lugar.color = "darkgreen";
    if (this.createForm.value.colorVal == "15")
      this.tipo_lugar.color = "violet";

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


