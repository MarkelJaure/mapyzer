import { LatLngExpression } from 'leaflet';

export interface GeometryLugar {
    type: string;

    coordinates: LatLngExpression;
}
