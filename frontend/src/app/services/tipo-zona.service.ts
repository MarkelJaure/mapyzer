import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { TipoZona } from '../models/tipoZona';
import { DataPackage } from '../models/data-package';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class TipoZonaService {

    constructor(private http: HttpClient,) { }

    private tiposZonasUrl = `${environment.baseUrl}/tiposZonas`;  // URL to web api


    getTiposZonas(): Observable<DataPackage> {
        return this.http.get<DataPackage>(`${this.tiposZonasUrl}/especificaciones`);
    }

    get(id: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(`${this.tiposZonasUrl}/${id}`);
    }

    save(tipo_zona: TipoZona): Observable<DataPackage> {
        if (tipo_zona.id) {
            return this.http.put<DataPackage>(`${this.tiposZonasUrl}/update`, tipo_zona);
        }
        else {
            return this.http.post<DataPackage>(`${this.tiposZonasUrl}/`, tipo_zona);
        }
    }

    search(text: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(`${this.tiposZonasUrl}/search/${text}`);
    }

    byPage(page: number, cant: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(`${this.tiposZonasUrl}?page=${page}&size=${cant}`);
    }
}
