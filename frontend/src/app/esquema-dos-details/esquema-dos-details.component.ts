import { Component, OnInit } from '@angular/core';
import { Lugar } from '../models/lugar';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Range } from '../models/range';
import { TipoLugar } from '../models/tipoLugar';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LugarService } from '../services/lugar.service';
import { TipoLugarService } from '../services/tipo-lugar.service';
import { Location } from '@angular/common';
import { ToastService } from '../services/toast.service';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { Results } from '../models/results';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario';
import { Proyecto } from '../models/proyecto';
import { ProyectoService } from '../services/proyecto.service';
import { CryptoService } from '../services/crypto.service';
const provider = new OpenStreetMapProvider();
const searchControl = GeoSearchControl({
  provider: provider,
});

@Component({
  selector: 'app-esquema-dos-details',
  templateUrl: './esquema-dos-details.component.html',
  styleUrls: ['./esquema-dos-details.component.css']
})
export class EsquemaDosDetailsComponent implements OnInit {

  lugar: Lugar;
  searching = false;
  searchFailed = false;
  range: Range[] = [];
  proyectoId: string;
  tiposLugares: TipoLugar[] = [];
  hasta = null
  desde = null
  currentUser: Usuario;
  error = null;


  calle: string = '';
  ciudad: string = '';
  altura: string = '';

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
    public cryptoService:CryptoService
  ) {
    this.usuarioService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.proyectoId = history.state.data;
    this.get();
    this.getTiposLugares();

    this.createForm = new FormGroup({
      codigoVal: new FormControl('', [Validators.required, Validators.maxLength(15)]),
      nombreVal: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      descripcionVal: new FormControl('', [Validators.maxLength(60)]),
      desdeVal: new FormControl(),
      hastaVal: new FormControl(),
      zonaVal: new FormControl(),
      calleVal: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9. ]*')]),
      alturaVal: new FormControl('', [Validators.min(0)]),
      ciudadVal: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9. ]*')]),
      tipoLugVal: new FormControl('', [Validators.required]),
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
      const date = new Date();
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
        var cadenas = this.lugar.localizacion.split(",")
        var calleYAltura = cadenas[0].split(" ");
        this.ciudad = cadenas.pop()
        if (calleYAltura.length > 1) {
          this.altura = calleYAltura.pop()
        }
        this.calle = calleYAltura.join(' ')
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

  getTiposLugares(): void {
    this.tiposLugarService.getTiposLugares().subscribe((dataPackage) => {
      this.tiposLugares = (dataPackage.data as TipoLugar[]);
    });
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
    const that = this;
    this.searchAddress(this.calle, this.altura, this.ciudad).then(function () {
      if (that.lugar.punto.coordinates[0]) {
        that.lugarService.save(that.lugar, that.proyectoId)
          .subscribe(dataPackage => {
            that.lugar = (dataPackage.data as Lugar);
            that.goBack();
          }, res => {
            that.error = res
            that.showError(res.error.message);
          })
      } else {
        that.error = { error: { message: "No se encontro ningun lugar con la localizacion indicada" } }
        that.showError("No se encontro ningun lugar con la localizacion indicada");
      }
    }).catch(function (reason) {
      that.error = reason
      that.showError("Error" + reason);
    })

  }



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

  get f(): { [p: string]: AbstractControl } {
    return this.createForm.controls;
  }

  actualizarLocaclizacion(): void {
    this.lugar.localizacion = `${(this.calle) ? this.calle : ''} ${(this.altura) ? this.altura + ',' : ''}${(this.ciudad) ? this.ciudad : ''}`;
  }

  async searchAddress(direccion: string, altura: string, ciudad: string) {
    var busqueda
    if (direccion) {
      if (altura) {
        busqueda = direccion + " " + altura + "," + ciudad;
      } else {
        busqueda = direccion + "," + ciudad;
      }
    } else {
      busqueda = ciudad;
    }
    const results = <Results><unknown>await provider.search({ query: busqueda }).catch(function (reason) {
      throw { error: { message: reason } }
    })
      ;

    if (results[0]) {
      this.lugar.localizacion = busqueda
      this.lugar.punto.coordinates[0] = results[0].y
      this.lugar.punto.coordinates[1] = results[0].x
    } else {
      throw { error: { message: "No se encontro ningun lugar con la localizacion indicada" } }
    }
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.createForm.invalid) {
      return;
    }

    this.save();
  }

  showError(message: string): void {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 4000 });
  }


}
