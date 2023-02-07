import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap, switchMap, map } from 'rxjs/operators';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';

import { Zona } from '../models/zona';
import { ZonaService } from '../services/zona.service';
import { Range } from '../models/range';
import { TipoZona } from '../models/tipoZona';
import { TipoZonaService } from '../services/tipo-zona.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { LatLngExpression } from 'leaflet';
import { createThis } from 'typescript';
import { UsuarioService } from '../services/usuario.service';
import { ProyectoService } from '../services/proyecto.service';
import { Proyecto } from '../models/proyecto';
import { Usuario } from '../models/usuario';
import { CryptoService } from '../services/crypto.service';
import { ParseadorDeFecha } from '../lib/ParseadorDeFecha';

@Component({
  selector: 'app-esquema-tres-details',
  templateUrl: './esquema-tres-details.component.html',
  styleUrls: ['./esquema-tres-details.component.css']
})
export class EsquemaTresDetailsComponent implements OnInit {

  zona: Zona;
  searching = false;
  searchFailed = false;
  range: Range[] = [];
  hasta = null
  desde = null
  proyectoId: string;
  tiposZonas: TipoZona[] = [];
  isCoordenadaShow = true
  currentUser: Usuario;
  error = '';


  createForm: FormGroup;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private ZonaService: ZonaService,
    private tipoZonaService: TipoZonaService,
    private location: Location,
    public toastService: ToastService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService,
    private proyectoService: ProyectoService,
    public cryptoService: CryptoService
  ) {
    this.usuarioService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.proyectoId = history.state.data;
    this.getTiposZonas();
    this.get()


    this.createForm = new FormGroup({
      codigoVal: new FormControl('', [Validators.required, Validators.maxLength(15)]),
      nombreVal: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      desdeVal: new FormControl(),
      hastaVal: new FormControl(),
      tipoZonaVal: new FormControl('', [Validators.required]),
      descripcionVal: new FormControl('', [Validators.maxLength(60)]),
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
      const dateDesde = new Date();
      this.zona = {
        id: null,
        zona: null,
        codigo: null,
        poligono: { type: null, coordinates: new Array<LatLngExpression[]>() as LatLngExpression[][] },
        descripcion: null,
        tipos_zona: null as TipoZona,
        validity: [{ value: null, inclusive: false }, { value: null, inclusive: false }],
        isvalid: true,
      };
      this.zona.poligono.coordinates[0] = new Array()
    } else {
      
      this.ZonaService.get(+id).subscribe((dataPackage) => {
        this.zona = dataPackage.data as Zona;

        if (this.zona.validity[0].value) {
          var cadena = this.zona.validity[0].value.toString().split("")
          cadena.pop()
          this.desde = cadena.join("")
        }
        if (this.zona.validity[1].value) {
          var cadena = this.zona.validity[1].value.toString().split("")
          cadena.pop()
          this.hasta = cadena.join("")
        }
      }
      );
    }
  }

  getTiposZonas(): void {
    this.tipoZonaService.getTiposZonas().subscribe((dataPackage) => {
      this.tiposZonas = (dataPackage.data as TipoZona[]);
    });
  }

  searchTipoZona = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.tipoZonaService
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

  resultTipoZonaFormat(value: any): string {
    return value.tipo_zona;
  }

  inputTipoZonaFormat(value: any): string {
    if (value) {
      return value.tipo_zona;
    }
    return null;
  }

  goBack(): void {
    this.location.back();
  }

  get f(): { [p: string]: AbstractControl } {
    return this.createForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.createForm.invalid) {
      return;
    }
    if (this.zona.poligono.coordinates[0].length < 4) {
      for (var i = 4 - this.zona.poligono.coordinates[0].length; i > 0; i--) {
        this.addCoordenada()
      }
      return;
    }
    
    for (var i = 0; i < this.zona.poligono.coordinates[0].length; i++) {
      if ((this.zona.poligono.coordinates[0][i][0] == null) || (this.zona.poligono.coordinates[0][i][1] == null)) {
        return;
      }
    }

    this.save();
  }

  save(): void {
    if (this.desde) {
      var dateDesde = new Date(this.desde)
      this.zona.validity[0] = { inclusive: true, value: new Date(Date.UTC(dateDesde.getFullYear(), dateDesde.getMonth(), dateDesde.getDate(), dateDesde.getHours(), dateDesde.getMinutes())) };
    } else {
      this.zona.validity[0] = { value: null, inclusive: false };
    }
    if (this.hasta) {
      var dateHasta = new Date(this.hasta)
      this.zona.validity[1] = { inclusive: true, value: new Date(Date.UTC(dateHasta.getFullYear(), dateHasta.getMonth(), dateHasta.getDate(), dateHasta.getHours(), dateHasta.getMinutes())) };
    } else {
      this.zona.validity[1] = { value: null, inclusive: false };
    }
    const length = this.zona.poligono.coordinates[0].length;
    // if ((this.zona.poligono.coordinates[0][0][0] != this.zona.poligono.coordinates[0][length-1][0]) || (this.zona.poligono.coordinates[0][0][1] != this.zona.poligono.coordinates[0][length-1][1])){
    //   this.zona.poligono.coordinates[0].push([this.zona.poligono.coordinates[0][0][0],this.zona.poligono.coordinates[0][0][1]])
    // }
    this.ZonaService.save(this.zona, this.proyectoId)
      .subscribe(dataPackage => {
        this.zona = (dataPackage.data as Zona);
        this.goBack();

      }, res => {
        this.error = res
        this.showError(res.error.message);
      });

  }

  parsearFecha(validity){
    if (validity) {
      validity[0].value = ParseadorDeFecha.parsearValor(validity[0].value)
      validity[0].value = validity[0].value =="Infinite" ? "-Infinite" : validity[0].value;
      validity[1].value = ParseadorDeFecha.parsearValor(validity[1].value)
    }
    return validity
  }


  showError(message: string): void {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 8000 });
  }

  addCoordenada(): void {
    this.zona.poligono.coordinates[0].push([undefined, undefined])
    for (var i = 0; i < this.zona.poligono.coordinates[0].length; i++) {
      this.zona.poligono.coordinates[0][i] = [this.zona.poligono.coordinates[0][i][0], this.zona.poligono.coordinates[0][i][1]]
    }
  }

  removeCoordenada(coordenada: LatLngExpression): void {
    let coordenadas = this.zona.poligono.coordinates[0];
    coordenadas.splice(coordenadas.indexOf(coordenada), 1);
  }

  ngbDateToDate(): void {
  }

}
