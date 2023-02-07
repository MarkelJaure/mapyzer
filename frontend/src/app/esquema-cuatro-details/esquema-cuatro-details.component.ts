import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap, switchMap, map } from 'rxjs/operators';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';

import { Trayecto } from '../models/trayecto';
import { TrayectoService } from '../services/trayecto.service';
import { Range } from '../models/range';
import { TipoTrayecto } from '../models/tipoTrayecto';
import { GeometryTrayecto } from '../models/geometryTrayecto';
import { TipoTrayectoService } from '../services/tipo-trayecto.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { LatLngExpression } from 'leaflet';
import { createThis } from 'typescript';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario';
import { ProyectoService } from '../services/proyecto.service';
import { Proyecto } from '../models/proyecto';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-esquema-cuatro-details',
  templateUrl: './esquema-cuatro-details.component.html',
  styleUrls: ['./esquema-cuatro-details.component.css']
})
export class EsquemaCuatroDetailsComponent implements OnInit {

  trayecto: Trayecto;
  searching = false;
  searchFailed = false;
  range: Range[] = [];
  hasta = null
  desde = null
  proyectoId: string;
  tiposTrayectos: TipoTrayecto[] = [];
  currentUser: Usuario;
  error = '';


  createForm: FormGroup;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private trayectoService: TrayectoService,
    private tipotrayectoService: TipoTrayectoService,
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
    this.getTiposTrayectos();
    this.get()


    this.createForm = new FormGroup({
      codigoVal: new FormControl('', [Validators.required, Validators.maxLength(15)]),
      nombreVal: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      desdeVal: new FormControl(),
      hastaVal: new FormControl(),
      tipoTrayectoVal: new FormControl('', [Validators.required]),
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
      this.trayecto = {
        id: null,
        trayecto: null,
        codigo: null,
        curva: { type: null, coordinates: [] as LatLngExpression[] },
        descripcion: null,
        tipos_trayecto: null as TipoTrayecto,
        validity: [{ value: null, inclusive: false }, { value: null, inclusive: false }],
        isvalid: true,
      };
      this.trayecto.curva.coordinates = new Array()
    } else {

      this.trayectoService.get(+id).subscribe((dataPackage) => {
        this.trayecto = dataPackage.data as Trayecto;

        if (this.trayecto.validity[0].value) {
          var cadena = this.trayecto.validity[0].value.toString().split("")
          cadena.pop()
          this.desde = cadena.join("")
        }
        if (this.trayecto.validity[1].value) {
          var cadena = this.trayecto.validity[1].value.toString().split("")
          cadena.pop()
          this.hasta = cadena.join("")
        }
      }
      );
    }
  }

  getTiposTrayectos(): void {
    this.tipotrayectoService.getTiposTrayectos().subscribe((dataPackage) => {
      this.tiposTrayectos = (dataPackage.data as TipoTrayecto[]);
    });
  }

  searchTipoTrayecto = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.tipotrayectoService
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

  resultTipoTrayectoFormat(value: any): string {
    return value.tipo_trayecto;
  }

  inputTipoTrayectoFormat(value: any): string {
    if (value) {
      return value.tipo_trayecto;
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
    if (this.trayecto.curva.coordinates.length < 2) {
      for (var i = 2 - this.trayecto.curva.coordinates.length; i > 0; i--) {
        this.addCoordenada()
      }
      return;
    }

    for (var i = 0; i < this.trayecto.curva.coordinates.length; i++) {
      if ((this.trayecto.curva.coordinates[i][0] == null) || (this.trayecto.curva.coordinates[i][1] == null)) {
        return;
      }
    }

    this.save();
  }

  save(): void {
    if (this.desde) {
      var dateDesde = new Date(this.desde)
      this.trayecto.validity[0] = { inclusive: true, value: new Date(Date.UTC(dateDesde.getFullYear(), dateDesde.getMonth(), dateDesde.getDate(), dateDesde.getHours(), dateDesde.getMinutes())) };
    } else {
      this.trayecto.validity[0] = { value: null, inclusive: false };
    }
    if (this.hasta) {
      var dateHasta = new Date(this.hasta)
      this.trayecto.validity[1] = { inclusive: true, value: new Date(Date.UTC(dateHasta.getFullYear(), dateHasta.getMonth(), dateHasta.getDate(), dateHasta.getHours(), dateHasta.getMinutes())) };
    } else {
      this.trayecto.validity[1] = { value: null, inclusive: false };
    }
    const length = this.trayecto.curva.coordinates.length;
    this.trayectoService.save(this.trayecto, this.proyectoId)
      .subscribe(dataPackage => {
        this.trayecto = (dataPackage.data as Trayecto);
        this.goBack();

      }, res => {
        this.error = res
        this.showError(res.error.message);
      });

  }


  showError(message: string): void {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 4000 });
  }

  addCoordenada(): void {
    this.trayecto.curva.coordinates.push([undefined, undefined])
    for (var i = 0; i < this.trayecto.curva.coordinates.length; i++) {
      this.trayecto.curva.coordinates[i] = [this.trayecto.curva.coordinates[i][0], this.trayecto.curva.coordinates[i][1]]
    }
  }

  removeCoordenada(coordenada: LatLngExpression): void {
    let coordenadas = this.trayecto.curva.coordinates;
    coordenadas.splice(coordenadas.indexOf(coordenada), 1);
  }

}
