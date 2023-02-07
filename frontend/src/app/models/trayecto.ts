import { GeometryTrayecto } from './geometryTrayecto';
import { TipoTrayecto } from './tipoTrayecto';
import {Range} from "./range";

export interface Trayecto {

    id: number;

    codigo: string;

    trayecto: string;

    curva: GeometryTrayecto;

    descripcion: string;

    validity: Range[];

    tipos_trayecto: TipoTrayecto

    isvalid: boolean;
}


