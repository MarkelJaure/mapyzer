import { LatLngExpression } from 'leaflet';

export interface GeometryTrayecto {
    type: string;

    coordinates: LatLngExpression[];
}
