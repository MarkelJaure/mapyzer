import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { parseIsolatedEntityName } from 'typescript';
import { Persona } from '../models/persona';
import { Role } from '../models/role';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../services/usuario.service';
import { AlertService } from '../_alert/alert.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;
  usuario : Usuario
  error = '';

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private usuarioService: UsuarioService,
      private alertService: AlertService
  ) { 
    if (this.usuarioService.isLoggedIn()) { 
        this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.usuario = {
        id: null,
        username: null,
        persona: {name:null,ambito:null,dni:null,estudios:null,id:null,lastname:null,telefono:null,},
        email: null,
        rol: Role.Invitado,
        password: null,
        token:null,
      };
      this.form = this.formBuilder.group({
          nameVal: new FormControl('', [Validators.required,Validators.pattern("[a-zA-ZéáíóúüñÁÉÍÓÚÜÑ ]*")]),
          lastNameVal: new FormControl('', [Validators.required,,Validators.pattern("[a-zA-ZéáíóúüñÁÉÍÓÚÜÑ ]*")]),
          usernameVal: new FormControl('', [Validators.required,Validators.minLength(6),Validators.maxLength(15),Validators.pattern("[a-zA-Z0-9._-]*")]),
          dniVal: new FormControl('', [Validators.required,Validators.min(0),Validators.max(100000000),Validators.min(1000000)]),
          telefonoVal: new FormControl('', [Validators.required,Validators.min(0)]),
          ambitoVal: new FormControl('', [Validators.required]),
          estudiosVal: new FormControl('', [Validators.required]),
          emailVal: new FormControl('', [Validators.required]),
          passwordVal: new FormControl('', [Validators.required, Validators.minLength(6)]),
          confirmPasswordVal: new FormControl('', [Validators.required]),
      }, {
          validator: this.MustMatch('passwordVal', 'confirmPasswordVal')
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      if (this.form.invalid) {
          return;
      }

      this.loading = true;
      this.usuarioService.register(this.usuario)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.alertService.success('Registration successful, please check your email for verification instructions', { keepAfterRouteChange: true });
                  this.router.navigate(['../registerSuccesfull'], { relativeTo: this.route });
              },
              error: error => {
                  //this.alertService.error(error);
                  this.error = error;
                  this.loading = false;
              }
          });
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}
}