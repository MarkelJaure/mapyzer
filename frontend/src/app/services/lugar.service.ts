import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Lugar } from '../models/lugar';

import { DataPackage } from '../models/data-package';
import {environment} from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class LugarService {

  constructor(private http: HttpClient,) { }

  private lugaresUrl = `${environment.baseUrl}/lugares` //'http://localhost:3000/lugares';  // URL to web api

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.lugaresUrl}/${id}`);
  }

  getPertenece(): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.lugaresUrl}/per/per`);
  }

  getLugares(): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.lugaresUrl}`);
  }

  getLugaresWithDir(withDir: string, proyectoId: string, isvalid: boolean): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.lugaresUrl}/withDir/search?withDir=${withDir}&proyectoId=${proyectoId}&isvalid=${isvalid}`);
  }

  byPage(page: number, cant: number, lugar:String, fecha:String): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.lugaresUrl}/detalle?page=${page}&size=${cant}&lugar=${lugar}&fecha=${fecha}`);
  }

  getByProyectoByPage(id: number, page: number, cant: number, lugar:String, fecha:String, esquema: number, isvalid: boolean): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.lugaresUrl}/search/proyecto?id=${id}&page=${page}&size=${cant}&lugar=${lugar}&fecha=${fecha}&esquema=${esquema}&isvalid=${isvalid}`);
  }

  getByProyectoMap(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.lugaresUrl}/search/proyecto?id=${id}`);
  }

  save(lugar: Lugar, proyectoId: string): Observable<DataPackage> {
    if (lugar.id){
      return this.http.put<DataPackage>(`${this.lugaresUrl}/update`, lugar);
    }else{
      const headers = new HttpHeaders({ 'Proyecto-id': proyectoId});
      return this.http.post<DataPackage>(`${this.lugaresUrl}/${proyectoId}`, lugar, {headers});
    }
  }
  remove(id: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(`${this.lugaresUrl}/${id}`);
  }

  search(text: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.lugaresUrl}/search/${text}`);
  }

  searchTypes(text: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.lugaresUrl}/types/${text}`);
  }

  copyData(lugares: number[], proyectoId: string): Observable<DataPackage> {
    const headers = new HttpHeaders({ 'Proyecto-id': proyectoId});
    return this.http.post<DataPackage>(`${this.lugaresUrl}/copyData/${proyectoId}`, lugares, {headers});
  }

  deleteData(lugares: number[], proyectoId: string): Observable<DataPackage> {

    return this.http.post<DataPackage>(`${this.lugaresUrl}/deleteData/${proyectoId}`, lugares);
  }

}
