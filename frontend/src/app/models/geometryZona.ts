import { LatLngExpression } from 'leaflet';

export interface GeometryZona {
    type: string;

    coordinates: LatLngExpression[][];
}
