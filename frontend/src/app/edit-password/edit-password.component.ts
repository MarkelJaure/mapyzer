import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common'

import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css']
})
export class EditPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  currentUser: Usuario;
  password: string
  newPassword: string

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly location: Location,
    private readonly usuarioService: UsuarioService,
    public readonly toastService: ToastService,
  ) {
    this.usuarioService.currentUser.subscribe(x => this.currentUser = x);
    if (!this.usuarioService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  get f() { return this.passwordForm.controls; }

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      currentPasswordVal: ['', Validators.required],
      newPasswordVal: ['', Validators.required],
      confirmPasswordVal: ['', Validators.required],
    }, {
      validator: this.MustMatch('newPasswordVal', 'confirmPasswordVal')
    });
  }

  save() {
    this.loading = true;
    this.usuarioService.editPassword(this.currentUser, this.password, this.newPassword).subscribe(dataPackage => {
      this.currentUser = (dataPackage.data as Usuario);
      this.router.navigate(['/editProfile']);
    }, res => {
      this.error = res;
      this.showError(res.error.message);
      this.loading = false;
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

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.passwordForm.invalid) {
      return;
    }

    this.save();
  }

  goBack(): void {
    this.location.back();
  }

  showSuccess(message: string): void {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 4000 });
  }

  showError(message: string): void {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 4000 });
  }
}
