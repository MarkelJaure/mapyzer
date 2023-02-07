import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Usuario } from '../models/usuario';
import { DataPackage } from '../models/data-package';
import { Proyecto } from '../models/proyecto';
import { Role } from '../models/role';
import {environment} from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class UsuarioService {
    private currentUserSubject: BehaviorSubject<Usuario>;
    public currentUser: Observable<Usuario>;
    private usuariosUrl = `${environment.baseUrl}/users`;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<Usuario>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): Usuario {
        return this.currentUserSubject.value;
    }

    byPage(page: number, cant: number, rol: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(`${this.usuariosUrl}/detalle?page=${page}&size=${cant}&rol=${rol}`);
    }

    get(id: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(`${this.usuariosUrl}/${id}`);
    }

    updateRol(id: number, rol: string): Observable<DataPackage> {
        return this.http.put<DataPackage>(`${this.usuariosUrl}/updateRol`, { id: id, rol: rol });
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${this.usuariosUrl}/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user.data));
                this.currentUserSubject.next(user.data);
                return user;
            }));
    }

    forgotPassword(email: string,dni:number): Observable<DataPackage>  {
        return this.http.post<DataPackage>(`${this.usuariosUrl}/forgot-password`, { email, dni });
    }

    updateCurrentUser(usuario: Usuario) {
        localStorage.setItem('currentUser', JSON.stringify(usuario));
        this.currentUserSubject.next(usuario);
        return this.currentUser
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    register(usuario: Usuario) {
        return this.http.post(`${this.usuariosUrl}/register`, usuario);
    }

    editUser(usuario: Usuario): Observable<DataPackage> {
        return this.http.put<DataPackage>(`${this.usuariosUrl}/update`, usuario);
    }

    editPassword(usuario: Usuario, password: string, newPassword: string): Observable<DataPackage> {
        return this.http.put<DataPackage>(`${this.usuariosUrl}/updatePassword`, { usuario: usuario, password: password, newPassword: newPassword });
    }

    isLoggedIn() {
        return this.currentUserSubject.value != null
    }

    isCreatedByMe(proyecto: Proyecto) {
        return this.isLoggedIn() && (this.currentUserSubject.value.id === proyecto.usuario.id)
    }

    isAdmin() {
        return this.isLoggedIn() && this.currentUserSubject.value.rol == Role.Administrador
    }

    isUser() {
        return this.isLoggedIn() && (this.currentUserSubject.value.rol == Role.Usuario || this.currentUserSubject.value.rol == Role.Administrador)
    }
}
