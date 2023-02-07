import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UsuarioService } from './services/usuario.service';
import { Usuario } from './models/usuario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  value: String = ""
  currentUser: Usuario;

  constructor(
    private router: Router,
    public usuarioService: UsuarioService
  ) {
    this.usuarioService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.usuarioService.logout();
    this.usuarioService.currentUser.subscribe(x => this.currentUser = x);
    this.router.navigate(['/login']);
  }

  editProfile() {
    this.router.navigate(['/editProfile']);
  }
  
}

