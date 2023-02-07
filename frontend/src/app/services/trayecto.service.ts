import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DataPackage } from '../models/data-package';
import { Trayecto } from '../models/trayecto';
import {environment} from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class TrayectoService {

  constructor(private http: HttpClient,) { }

  private trayectosUrl = `${environment.baseUrl}/trayectos`;  // URL to web api

  getTrayectos():  Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.trayectosUrl}/especificaciones`);
  }

  byPage(page: number, cant: number, trayecto:String, fecha:String): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.trayectosUrl}?page=${page}&size=${cant}&trayecto=${trayecto}&fecha=${fecha}`);
  }

  getByProyecto(id: string, isvalid:boolean): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.trayectosUrl}/project/search?id=${id}&isvalid=${isvalid}`);
  }

  getByProyectoByPage(id: number, page: number, cant: number, lugar:String, fecha:String, isvalid: boolean): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.trayectosUrl}/search/proyecto?id=${id}&page=${page}&size=${cant}&lugar=${lugar}&fecha=${fecha}&isvalid=${isvalid}`);
  }

  save(trayecto: Trayecto, proyectoId: string): Observable<DataPackage> {
    if (trayecto.id){
      return this.http.put<DataPackage>(`${this.trayectosUrl}/update`, trayecto);
    }else{
      const headers = new HttpHeaders({ 'Proyecto-id': proyectoId});
      return this.http.post<DataPackage>(`${this.trayectosUrl}/${proyectoId}`, trayecto, {headers});
    }
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.trayectosUrl}/${id}`);
  }

  copyData(trayectos: number[], proyectoId: string): Observable<DataPackage> {
    const headers = new HttpHeaders({ 'Proyecto-id': proyectoId});
    return this.http.post<DataPackage>(`${this.trayectosUrl}/copyData/${proyectoId}`, trayectos, {headers});
  }

  deleteData(trayectos: number[], proyectoId: string): Observable<DataPackage> {
    const headers = new HttpHeaders({ 'Proyecto-id': proyectoId});
    return this.http.post<DataPackage>(`${this.trayectosUrl}/deleteData/${proyectoId}`, trayectos, {headers});
  }
}
