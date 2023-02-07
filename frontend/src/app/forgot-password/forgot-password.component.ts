import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { first, finalize } from 'rxjs/operators';

import { UsuarioService } from '../services/usuario.service'
import { CryptoService } from '../services/crypto.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  loading = false;
  submitted = false;
  error: ''
  success = false

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private cryptoService: CryptoService,
  ) {
    if (this.usuarioService.isLoggedIn()) {
      this.router.navigate(['/']);
  }
   }

  ngOnInit(): void {
    this.forgotForm = this.formBuilder.group({
      emailVal:new FormControl('', [Validators.required]),
      dniVal: new FormControl('', [Validators.required,Validators.min(0),Validators.max(100000000),Validators.min(1000000)]),
    });
  }

  get f() { return this.forgotForm.controls; }

  save() {
    this.usuarioService.forgotPassword(this.f.emailVal.value,this.f.dniVal.value)
      .pipe(first())
      .subscribe({
        next: (dataPackage) => {

          this.loading = false;
          this.error = '';
          this.success = true
          //const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';
          //this.router.navigate([returnUrl]);
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }


  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotForm.invalid) {
      return;
    }

    this.loading = true;
    this.save()
  }
}
