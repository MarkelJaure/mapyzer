import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { DataPackage } from '../models/data-package';
import {environment} from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class MapService {

 private baseUrl = `${environment.baseUrl}`

  constructor(private http: HttpClient,) { }

  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.baseUrl}/data`);
  }

  getZonas():  Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.baseUrl}/zonas`);
  }

  getLugares():  Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.baseUrl}/lugares`);
  }
}
