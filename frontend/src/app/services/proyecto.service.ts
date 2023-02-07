import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Proyecto } from '../models/proyecto';
import { DataPackage } from '../models/data-package';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  public proyectosAVisualizar: number[];

  constructor(private readonly http: HttpClient,) { }

  private readonly proyectosUrl = `${environment.baseUrl}/proyectos`;  // URL to web api

  getProyectos(): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.proyectosUrl}/especificaciones`);
  }

  getDatosProyecto(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.proyectosUrl}/especificaciones/${id}`);
  }

  getProyectosByIDs(idProyectos: number[]): Observable<DataPackage> {
    return this.http.post<DataPackage>(`${this.proyectosUrl}/especificacionesByIDs`, { idProyectos: idProyectos });
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.proyectosUrl}/${id}`);
  }

  save(proyecto: Proyecto): Observable<DataPackage> {
    if (proyecto.id) {
      return this.http.put<DataPackage>(`${this.proyectosUrl}/update`, proyecto);
    }
    else {
      return this.http.post<DataPackage>(`${this.proyectosUrl}/`, proyecto);
    }
  }

  removeProyecto(idProyecto: number): Observable<DataPackage> { 
    return this.http.delete<DataPackage>(`${this.proyectosUrl}/softDown?idProyecto=${idProyecto}`);
  }

  removeLugarCoordenadas(proyectoId: number, lugarId: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(`${this.proyectosUrl}/lugares?proyectoId=${proyectoId}&lugarId=${lugarId}`);
  }

  removeLugarDireccion(proyectoId: number, lugarId: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(`${this.proyectosUrl}/lugares?proyectoId=${proyectoId}&lugarId=${lugarId}`);
  }

  removeZona(proyectoId: number, zonaId: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(`${this.proyectosUrl}/zonas?proyectoId=${proyectoId}&zonaId=${zonaId}`);
  }

  removeTrayecto(proyectoId: number, trayectoId: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(`${this.proyectosUrl}/trayectos?proyectoId=${proyectoId}&trayectoId=${trayectoId}`);
  }

  byPage(page: number, cant: number, isValid:boolean): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.proyectosUrl}/byPage?page=${page}&size=${cant}&isValid=${isValid}`);
  }

  byUserByPage(page: number, cant: number, idUsuario: number, isValid:boolean): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.proyectosUrl}/byPageAndUser/${idUsuario}?page=${page}&size=${cant}&isValid=${isValid}`);
  }

  byUser(idUsuario: number, isValid: boolean): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.proyectosUrl}/byUser?${idUsuario}?isValid=${isValid}`);
  }


  

  updateProyectosAVisualizar(someProyectos: number[]) {
    this.proyectosAVisualizar = someProyectos
  }
}
