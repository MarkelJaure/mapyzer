import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-register-succesfull',
  templateUrl: './register-succesfull.component.html',
  styleUrls: ['./register-succesfull.component.css']
})
export class RegisterSuccesfullComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
  ) {

    if (this.usuarioService.isLoggedIn()) {
      this.router.navigate(['/']);
  }
   }

  ngOnInit(): void {
  }

}
