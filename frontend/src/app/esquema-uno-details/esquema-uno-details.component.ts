import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap, switchMap, map } from 'rxjs/operators';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';

import { Lugar } from '../models/lugar';
import { LugarService } from '../services/lugar.service';
import { Range } from '../models/range';
import { TipoLugar } from '../models/tipoLugar';
import { TipoLugarService } from '../services/tipo-lugar.service';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { UsuarioService } from '../services/usuario.service';
import { ProyectoService } from '../services/proyecto.service';
import { Usuario } from '../models/usuario';
import { Proyecto } from '../models/proyecto';
import { CryptoService } from '../services/crypto.service';


@Component({
  selector: 'app-esquema-uno-details',
  templateUrl: './esquema-uno-details.component.html',
  styleUrls: ['./esquema-uno-details.component.css']
})
export class EsquemaUnoDetailsComponent implements OnInit {

  lugar: Lugar;
  searching = false;
  searchFailed = false;
  range: Range[] = [];
  proyectoId: string;
  tiposLugares: TipoLugar[] = [];
  hasta = null
  desde = null
  currentUser: Usuario;
  error = '';

  createForm: FormGroup;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private lugarService: LugarService,
    private tiposLugarService: TipoLugarService,
    private location: Location,
    public toastService: ToastService,
    private router: Router,
    private usuarioService: UsuarioService,
    private proyectoService: ProyectoService,
    private cryptoService: CryptoService
  ) {
    this.usuarioService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.proyectoId = history.state.data;
    this.get();
    this.getTiposLugares();


    this.createForm = new FormGroup({
      codigoVal: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      nombreVal: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      descripcionVal: new FormControl('', [Validators.maxLength(60)]),
      desdeVal: new FormControl(),
      hastaVal: new FormControl(),
      zonaVal: new FormControl(),
      tipoLugVal: new FormControl('', [Validators.required]),
      latVal: new FormControl('', [Validators.required, Validators.min(-90), Validators.max(90)]),
      lonVal: new FormControl('', [Validators.required, Validators.min(-180), Validators.max(180)])
    });
  }

  getTiposLugares(): void {
    this.tiposLugarService.getTiposLugares().subscribe((dataPackage) => {
      this.tiposLugares = (dataPackage.data as TipoLugar[]);
    });
  }

  get(): void {
    const id = this.cryptoService.decryptURL(this.route.snapshot.paramMap.get('idlugar'));
    this.proyectoId = this.cryptoService.decryptURL(this.route.snapshot.paramMap.get('idproyecto'));

    this.proyectoService.get(+this.proyectoId).subscribe((dataPackage) => {
      var proyecto = <Proyecto>dataPackage.data;
      if (!this.usuarioService.isCreatedByMe(proyecto)) { //Vuelve al Home si el usuario que intenta ingresar no es el creador
        this.router.navigate(['/']);
      }
    });
    if (id === 'new') {
      this.lugar = {
        id: null,
        lugar: null,
        codigo: null,
        punto: { type: 'Point', coordinates: [null, null] },
        descripcion: null,
        tipos_lugare: null as TipoLugar,
        id_tipo_lugar: null,
        validity: [{ value: null, inclusive: false }, { value: null, inclusive: false }],
        localizacion: null,
        zona: null,
        isvalid: true,
      };
    } else {

      this.lugarService.get(+id).subscribe((dataPackage) => {
        this.lugar = dataPackage.data as Lugar;
        if (this.lugar.validity[0].value) {
          var cadena = this.lugar.validity[0].value.toString().split("")
          cadena.pop()
          this.desde = cadena.join("")
        }
        if (this.lugar.validity[1].value) {
          var cadena = this.lugar.validity[1].value.toString().split("")
          cadena.pop()
          this.hasta = cadena.join("")
        }
      }
      );
    }
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.desde) {
      var dateDesde = new Date(this.desde)
      this.lugar.validity[0] = { inclusive: true, value: new Date(Date.UTC(dateDesde.getFullYear(), dateDesde.getMonth(), dateDesde.getDate(), dateDesde.getHours(), dateDesde.getMinutes())) };
    } else {
      this.lugar.validity[0] = { value: null, inclusive: false };
    }
    if (this.hasta) {
      var dateHasta = new Date(this.hasta)
      this.lugar.validity[1] = { inclusive: true, value: new Date(Date.UTC(dateHasta.getFullYear(), dateHasta.getMonth(), dateHasta.getDate(), dateHasta.getHours(), dateHasta.getMinutes())) };
    } else {
      this.lugar.validity[1] = { value: null, inclusive: false };
    }
    this.lugarService.save(this.lugar, this.proyectoId)
      .subscribe(dataPackage => {
        this.lugar = (dataPackage.data as Lugar);
        this.goBack();
      }, res => {
        this.error = res
        this.showError(res.error.message);
      });

  }

  searchType = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.lugarService.searchTypes(term)
          .pipe(
            map(response =>
              response.data
            )
          )
          .pipe(
            tap(() => this.searchFailed = false),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            }))
      ),
      tap(() => this.searching = false)
    )

  searchTipoLugar = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.tiposLugarService
          .search(term)
          .pipe(map((response) => response.data))
          .pipe(
            tap(() => (this.searchFailed = false)),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            })
          )
      ),
      tap(() => (this.searching = false))
    )

  resultTipoLugarFormat(value: any): string {
    return value.tipo_lugar;
  }

  inputTipoLugarFormat(value: any): string {
    if (value) {
      return value.tipo_lugar;
    }
    return null;
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.createForm.invalid) {
      return;
    }

    this.save();
  }

  get f(): { [p: string]: AbstractControl } {
    return this.createForm.controls;
  }

  showSuccess(message: string): void {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 4000 });
  }

  showError(message: string): void {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 4000 });
  }
}
