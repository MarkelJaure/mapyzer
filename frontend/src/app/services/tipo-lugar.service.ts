import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { TipoLugar } from '../models/tipoLugar'
import { DataPackage } from '../models/data-package';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TipoLugarService {

  constructor(private http: HttpClient,) { }

  private tiposLugaresUrl = `${environment.baseUrl}/tiposLugares`

  getTiposLugares(): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.tiposLugaresUrl}/especificaciones`);
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.tiposLugaresUrl}/${id}`);
  }

  save(tipo_lugar: TipoLugar): Observable<DataPackage> {
    if (tipo_lugar.id) {
      return this.http.put<DataPackage>(`${this.tiposLugaresUrl}/update`, tipo_lugar);
    }
    else {
      return this.http.post<DataPackage>(`${this.tiposLugaresUrl}/`, tipo_lugar);
    }
  }

  search(text: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.tiposLugaresUrl}/search/${text}`);
  }

  byPage(page: number, cant: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.tiposLugaresUrl}?page=${page}&size=${cant}`);
  }

}
