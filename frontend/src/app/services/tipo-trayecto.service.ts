import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { TipoTrayecto } from '../models/tipoTrayecto'
import { DataPackage } from '../models/data-package';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TipoTrayectoService {

  constructor(private http: HttpClient,) { }

  private tiposTrayectosUrl = `${environment.baseUrl}/tiposTrayectos`;  // URL to web api

  getTiposTrayectos(): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.tiposTrayectosUrl}/especificaciones`);
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.tiposTrayectosUrl}/${id}`);
  }

  save(tipo_trayecto: TipoTrayecto): Observable<DataPackage> {
    if (tipo_trayecto.id) {
      return this.http.put<DataPackage>(`${this.tiposTrayectosUrl}/update`, tipo_trayecto);
    }
    else {
      return this.http.post<DataPackage>(`${this.tiposTrayectosUrl}/`, tipo_trayecto);
    }
  }

  search(text: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.tiposTrayectosUrl}/search/${text}`);
  }

  byPage(page: number, cant: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.tiposTrayectosUrl}?page=${page}&size=${cant}`);
  }

}
