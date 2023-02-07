import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapComponent } from './map/map.component';
import { HomeComponent } from './home/home.component';
import { UploadComponent } from './upload/upload.component';
import { LugaresComponent } from './lugares/lugares.component';
import { ZonasComponent } from './zonas/zonas.component';
import { TrayectosComponent } from './trayectos/trayectos.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { ProyectoDetailsComponent } from './proyecto-details/proyecto-details.component';
import { DatosProyectoComponent } from './datos-proyecto/datos-proyecto.component';
import { MapProyectoComponent } from './map-proyecto/map-proyecto.component';
import { ToastGlobalComponent } from './toast-global/toast-global.component';
import { EsquemaUnoDetailsComponent } from './esquema-uno-details/esquema-uno-details.component';
import { EsquemaDosDetailsComponent } from './esquema-dos-details/esquema-dos-details.component';
import { EsquemaTresDetailsComponent } from './esquema-tres-details/esquema-tres-details.component';
import { EsquemaCuatroDetailsComponent } from './esquema-cuatro-details/esquema-cuatro-details.component';
import { TipoLugarDetailsComponent } from './tipo-lugar-details/tipo-lugar-details.component';
import { TipoZonaDetailsComponent } from './tipo-zona-details/tipo-zona-details.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { TipoTrayectoDetailsComponent } from './tipo-trayecto-details/tipo-trayecto-details.component';
import { TiposDeComponent } from './tipos-de/tipos-de.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioDetailsComponent } from './usuario-details/usuario-details.component';
import { MapProyectosComponent } from './map-proyectos/map-proyectos.component';
import { RegisterSuccesfullComponent } from './register-succesfull/register-succesfull.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'map', component: MapComponent },
  { path: 'mapProyectos', component: MapProyectosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'editProfile', component: EditProfileComponent },
  { path: 'editPassword', component: EditPasswordComponent },
  { path: 'lugares', component: LugaresComponent },
  { path: 'zonas', component: ZonasComponent },
  { path: 'trayectos', component: TrayectosComponent },
  { path: 'DatosProyecto/:idproyecto/esquema1/:idlugar', component: EsquemaUnoDetailsComponent },
  { path: 'DatosProyecto/:idproyecto/esquema2/:idlugar', component: EsquemaDosDetailsComponent },
  { path: 'DatosProyecto/:idproyecto/esquema3/:idlugar', component: EsquemaTresDetailsComponent },
  { path: 'DatosProyecto/:idproyecto/esquema4/:idlugar', component: EsquemaCuatroDetailsComponent },
  { path: 'DatosProyecto/:idproyecto/upload', component: UploadComponent },
  { path: 'proyectos', component: ProyectosComponent },
  { path: 'usuarios', component: UsuariosComponent},
  { path: 'usuarios/:id', component: UsuarioDetailsComponent},
  { path: 'proyectos/:id', component: ProyectoDetailsComponent },
  { path: 'DatosProyecto/:id', component: DatosProyectoComponent },
  { path: 'DatosProyecto/:id/map', component: MapProyectoComponent },
  { path: 'tipo_lugar/:id', component: TipoLugarDetailsComponent },
  { path: 'tipo_zona/:id', component: TipoZonaDetailsComponent },
  { path: 'tipo_trayecto/:id', component: TipoTrayectoDetailsComponent },
  { path: 'tipos_de', component: TiposDeComponent },
  { path: 'registerSuccesfull', component: RegisterSuccesfullComponent },  
  { path: 'forgot-password', component: ForgotPasswordComponent },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
