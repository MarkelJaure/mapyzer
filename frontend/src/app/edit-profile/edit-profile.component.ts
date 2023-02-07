import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Usuario } from '../models/usuario';
import { UsuarioService } from '../services/usuario.service';
import { ToastService } from '../services/toast.service';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  currentUser: Usuario;
  editUser: Usuario;
  createForm: FormGroup;
  submitted = false;
  error = '';

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private location: Location,
    public toastService: ToastService,
    private cryptoService: CryptoService,
  ) {
    this.usuarioService.currentUser.subscribe(x => this.currentUser = x);
    if (!this.usuarioService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.get();

    this.createForm = new FormGroup({
      nameVal: new FormControl('', [Validators.required,Validators.pattern("[a-zA-ZéáíóúüñÁÉÍÓÚÜÑ ]*")]),
      lastNameVal: new FormControl('', [Validators.required,Validators.pattern("[a-zA-ZéáíóúüñÁÉÍÓÚÜÑ ]*")]),
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

  get f() { return this.createForm.controls; }

  get() {
    this.editUser = {
      id: this.currentUser.id,
      username: this.currentUser.username,
      email: this.currentUser.email,
      password: null,
      token: null,
      rol: this.currentUser.rol,
      persona: {
        id: this.currentUser.persona.id,
        name: this.currentUser.persona.name,
        lastname: this.currentUser.persona.lastname,
        dni: this.currentUser.persona.dni,
        telefono: this.currentUser.persona.telefono,
        ambito: this.currentUser.persona.ambito,
        estudios: this.currentUser.persona.estudios,
      }
    }
  }

  save() {
    this.usuarioService.editUser(this.editUser).subscribe(dataPackage => {
      this.currentUser = (dataPackage.data as Usuario);
      this.usuarioService.updateCurrentUser(this.currentUser);
      //this.router.navigate(['/editProfile']);
      this.goBack();
    }, res => {
      //this.showError(res.error.message);
      this.error = res
    });

  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
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
