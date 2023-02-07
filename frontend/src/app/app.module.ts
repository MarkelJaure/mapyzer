import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MapComponent } from './map/map.component';
import { HomeComponent } from './home/home.component';
import { UploadComponent } from './upload/upload.component';
import { LugaresComponent } from './lugares/lugares.component';
import { ZonasComponent } from './zonas/zonas.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { DatosProyectoComponent } from './datos-proyecto/datos-proyecto.component';
import { EsquemaUnoDetailsComponent } from './esquema-uno-details/esquema-uno-details.component';
import { MapProyectoComponent } from './map-proyecto/map-proyecto.component';
import { ToastGlobalComponent } from './toast-global/toast-global.component';
import { ToastsContainerComponent } from './toasts-container/toasts-container.component';
import { EsquemaDosDetailsComponent } from './esquema-dos-details/esquema-dos-details.component';
import { NgBootstrapFormValidationModule } from "ng-bootstrap-form-validation";
import { ModalNuevoLugarComponent } from './modal-nuevo-lugar/modal-nuevo-lugar.component';
import { ProyectoDetailsComponent } from './proyecto-details/proyecto-details.component';
import { TipoLugarDetailsComponent } from './tipo-lugar-details/tipo-lugar-details.component';
import { TipoZonaDetailsComponent } from './tipo-zona-details/tipo-zona-details.component';
import { EsquemaTresDetailsComponent } from './esquema-tres-details/esquema-tres-details.component';
import { TrayectosComponent } from './trayectos/trayectos.component';
import { EsquemaCuatroDetailsComponent } from './esquema-cuatro-details/esquema-cuatro-details.component';
import { AlertModule } from "./_alert";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { TipoTrayectoDetailsComponent } from './tipo-trayecto-details/tipo-trayecto-details.component';
import { ModalComponent } from './modal/modal.component';
import { ModalCsvPreviewComponent } from './modal-csv-preview/modal-csv-preview.component';
import { TiposDeComponent } from './tipos-de/tipos-de.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioDetailsComponent } from './usuario-details/usuario-details.component';
import { MapProyectosComponent } from './map-proyectos/map-proyectos.component';
import { RegisterSuccesfullComponent } from './register-succesfull/register-succesfull.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    HomeComponent,
    UploadComponent,
    LugaresComponent,
    ZonasComponent,
    TrayectosComponent,
    ProyectosComponent,
    DatosProyectoComponent,
    MapProyectoComponent,
    ToastGlobalComponent,
    ToastsContainerComponent,
    ModalNuevoLugarComponent,
    EsquemaUnoDetailsComponent,
    EsquemaDosDetailsComponent,
    ModalNuevoLugarComponent,
    ProyectoDetailsComponent,
    TipoLugarDetailsComponent,
    TipoZonaDetailsComponent,
    EsquemaTresDetailsComponent,
    EsquemaCuatroDetailsComponent,
    LoginComponent,
    RegisterComponent,
    EditProfileComponent,
    EditPasswordComponent,
    TipoTrayectoDetailsComponent,
    ModalComponent,
    ModalCsvPreviewComponent,
    TiposDeComponent,
    UsuariosComponent,
    UsuarioDetailsComponent,
    MapProyectosComponent,
    RegisterSuccesfullComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule.forRoot(),
    NgBootstrapFormValidationModule,
    AlertModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
