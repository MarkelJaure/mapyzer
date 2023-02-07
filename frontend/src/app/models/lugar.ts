import {GeometryLugar} from './geometryLugar';
import { TipoLugar } from './tipoLugar';
import {Zona} from './zona';
import {Range} from "./range";

export interface Lugar {

  id: number;

  codigo: string;

  zona: Zona;

  lugar: string;

  localizacion: string;

  punto: GeometryLugar;

  descripcion: string;

  tipos_lugare: TipoLugar;

  id_tipo_lugar: number;

  validity: Range[];

  isvalid: boolean;
}
