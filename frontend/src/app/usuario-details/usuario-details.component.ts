import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../models/usuario';
import { ToastService } from '../services/toast.service';
import { UsuarioService } from '../services/usuario.service';
import { AlertService } from '../_alert';
import { Location } from '@angular/common';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-usuario-details',
  templateUrl: './usuario-details.component.html',
  styleUrls: ['./usuario-details.component.css']
})
export class UsuarioDetailsComponent implements OnInit {

  usuario:Usuario  
  searching: boolean = false;
  searchFailed: boolean = false;
  createForm: FormGroup;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public toastService: ToastService,
    public alertService: AlertService,
    public usuarioService: UsuarioService,
    private router: Router,
    private cryptoService: CryptoService,
  ) {
    if (!usuarioService.isAdmin()){
      this.router.navigate(['/']);
    }
   }

  ngOnInit(): void {
    this.get()

    this.createForm = new FormGroup({
      nameVal: new FormControl('', [Validators.required,Validators.pattern("[a-zA-Z ]*")]),
      lastNameVal: new FormControl('', [Validators.required,Validators.pattern("[a-zA-Z ]*")]),
      usernameVal: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern("[a-zA-Z0-9._-]*")]),
      dniVal: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100000000), Validators.min(1000000)]),
      telefonoVal: new FormControl('', [Validators.required, Validators.min(0)]),
      ambitoVal: new FormControl('', [Validators.required]),
      estudiosVal: new FormControl('', [Validators.required]),
      emailVal: new FormControl('', [Validators.required]),
      passwordVal: new FormControl('', [Validators.required, Validators.minLength(6)]),
      rolVal: new FormControl('', [Validators.required]),
    });
  }

  get(){
    const id = this.cryptoService.decryptURL(this.route.snapshot.paramMap.get('id'));
    if (id === 'new') {
      this.usuario = {
        id: null,
        email:null,
        password:null,
        persona: {name:null,ambito:null,dni:null,estudios:null,id:null,lastname:null,telefono:null,},
        rol:null,
        token:null,
        username:null,

      };

    } else {
      this.usuarioService.get(+id).subscribe((dataPackage) => {
        this.usuario = <Usuario>dataPackage.data;

      });
    }

  }
  
  goBack(): void {
    this.location.back();
  }

}
