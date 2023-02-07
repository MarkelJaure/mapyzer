import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {DataPackage} from "../models/data-package";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {

  private baseUrl = `${environment.baseUrl}`

  constructor(
    private http: HttpClient,
  ) {
  }

  upload(file: File, nroEsquema: string, proyectoId: string): Observable<HttpEvent<any>> {
    const header = new HttpHeaders({numEsquema: nroEsquema, proyectoId: proyectoId});
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload/esquemaCsvUno`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: header
    });

    return this.http.request(req);
  }

  createDirecciones(dirs, proyectoId): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', `${this.baseUrl}/dirs/${proyectoId}`,
      {dirs},
      {
        reportProgress: true,
        responseType: 'json'
      })
    return this.http.request(req);
  }
}

