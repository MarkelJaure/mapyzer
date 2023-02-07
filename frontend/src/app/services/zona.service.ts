import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DataPackage } from '../models/data-package';
import { Zona } from '../models/zona';
import {environment} from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class ZonaService {

  constructor(private http: HttpClient,) { }

  private zonasUrl = `${environment.baseUrl}/zonas`;  // URL to web api

  getZonas():  Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.zonasUrl}/especificaciones`);
  }

  byPage(page: number, cant: number, zona:String, fecha:String): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.zonasUrl}?page=${page}&size=${cant}&zona=${zona}&fecha=${fecha}`);
  }

  getByProyecto(id: string, isvalid: boolean): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.zonasUrl}/project/search?id=${id}&isvalid=${isvalid}`);
  }

  getByProyectoByPage(id: number, page: number, cant: number, lugar:String, fecha:String, isvalid: boolean): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.zonasUrl}/search/proyecto?id=${id}&page=${page}&size=${cant}&lugar=${lugar}&fecha=${fecha}&isvalid=${isvalid}`);
  }

  save(zona: Zona, proyectoId: string): Observable<DataPackage> {
    if (zona.id){
      return this.http.put<DataPackage>(`${this.zonasUrl}/update`, zona);
    }else{
      const headers = new HttpHeaders({ 'Proyecto-id': proyectoId});
      return this.http.post<DataPackage>(`${this.zonasUrl}/${proyectoId}`, zona, {headers});
    }
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.zonasUrl}/${id}`);
  }

  copyData(zonas: number[], proyectoId: string): Observable<DataPackage> {
    const headers = new HttpHeaders({ 'Proyecto-id': proyectoId});
    return this.http.post<DataPackage>(`${this.zonasUrl}/copyData/${proyectoId}`, zonas, {headers});
  }

  deleteData(zonas: number[], proyectoId: string): Observable<DataPackage> {
    const headers = new HttpHeaders({ 'Proyecto-id': proyectoId});
    return this.http.post<DataPackage>(`${this.zonasUrl}/deleteData/${proyectoId}`, zonas, {headers});
  }
}
