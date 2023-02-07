import { GeometryZona } from './geometryZona';
import { TipoZona } from './tipoZona';
import {Range} from "./range";

export interface Zona {

    id: number;

    codigo: string;

    zona: string;

    poligono: GeometryZona;

    descripcion: string;

    validity: Range[];

    tipos_zona: TipoZona

    isvalid: boolean;
}


