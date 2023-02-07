import { Lugar } from './lugar';
import { Trayecto } from './trayecto';
import { Usuario } from './usuario';
import { Zona } from './zona';

export interface Proyecto {

    id: number

    proyecto: string

    usuario: Usuario

    descripcion: string

    observaciones: string

    timegen: Date

    lugares: Lugar[]

    zonas: Zona[]

    trayectos: Trayecto[]

    visibilidad: string

    isvalid: boolean

}