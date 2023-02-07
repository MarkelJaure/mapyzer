import * as L from "leaflet";
import { LUGAR, TRAYECTO, ZONA } from "../data.config";
import { ParseadorDeFecha } from "../ParseadorDeFecha";

export class DataOnMapFactory {

    static crearDataOnMapController(tipoControlador: string) {
        switch (tipoControlador) {
            case LUGAR: return new DataOnMapControllerLugar;
            case ZONA: return new DataOnMapControllerZona;
            case TRAYECTO: return new DataOnMapControllerTrayecto;
            default: return new DataOnMapController;
        }
    }
}

export class DataOnMapController {

    makeVisualDataByData(data) {
        return new Array()
    }

    addVisualDataToMap(map, visualData) {
        for (const aDato of visualData) {
            aDato.addTo(map)
        }
    }

    removeVisualDataOfMap(map, visualData) {
        for (const aDato of visualData) {
            map.removeLayer(aDato);
        }

    }
}

class DataOnMapControllerLugar extends DataOnMapController {

    makeVisualDataByData(lugares) {
        let colorIcono: string;
        let tamañoMarcador: L.PointExpression;
        let tamañoSombra: L.PointExpression;
        let icono: string;
        let tipoMarcador: string;

        const markers = new Array()

        const saltoAndInicioDeLinea = "'</li><li>";

        for (const lugar of lugares) { //Crea el marcador a partir de un lugar

            // Aqui se definen los atributos del Icono, según el TipoLugar
            tipoMarcador = (lugar.tipos_lugare.tipo_marcador != null) ? "-" + lugar.tipos_lugare.tipo_marcador : "";
            icono = (lugar.tipos_lugare.icono != null) ? "-" + lugar.tipos_lugare.icono : "";
            colorIcono = (lugar.tipos_lugare.color != null) ? lugar.tipos_lugare.color : 'red';

            const defaultTamanioMarcador: L.PointExpression = [25, 40];
            const defaultTamanioSombra: L.PointExpression = [40,40];
            

            tamañoMarcador = (lugar.tipos_lugare.size != null) ? [(lugar.tipos_lugare.size + (lugar.tipos_lugare.size / 4)), lugar.tipos_lugare.size * 2] : defaultTamanioMarcador;
            tamañoSombra = (lugar.tipos_lugare.size != null) ? [lugar.tipos_lugare.size * 2, lugar.tipos_lugare.size * 2] : defaultTamanioSombra;

            //Agrega el marcador al mapa y al arreglo de marcadores
            const marcador = L.marker(lugar.punto.coordinates, {
                icon: new L.Icon({
                    iconUrl: 'https://raw.githubusercontent.com/gustavonunezlab/icons/main/' + colorIcono + tipoMarcador + icono + '-matte.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: tamañoMarcador,
                    shadowSize: tamañoSombra,
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34]
                })
            }).bindPopup(
                '<h2>' + lugar.lugar +
                '</h2><p>Informacion acerca del marcador: </p><ul><li>Descripcion: ' + (lugar.descripcion ? lugar.descripcion : "") +
                saltoAndInicioDeLinea + 'Tipo de lugar: ' + lugar.tipos_lugare.tipo_lugar
                + (lugar.localizacion ? '</li><li>Dirección: ' + lugar.localizacion : saltoAndInicioDeLinea + 'Coordenadas: ' + lugar.punto.coordinates)
                + saltoAndInicioDeLinea +' Fecha inicio: ' + ParseadorDeFecha.parsearValor(lugar.validity[0].value)
                + saltoAndInicioDeLinea + 'Fecha fin: ' + ParseadorDeFecha.parsearValor(lugar.validity[1].value) +
                '</li></ul>'
            )


            markers.push(marcador);

        }
        return markers
    }



}

class DataOnMapControllerZona extends DataOnMapController {

    makeVisualDataByData(zonas) {
        let polygon;
        const polygons = new Array()
        for (const zona of zonas) {
            polygon = L.polygon(zona.poligono.coordinates, {
                dashArray: zona.tipos_zona.tipo_linea,
                color: zona.tipos_zona.color,
                weight: 2,
                fillColor: zona.tipos_zona.color_relleno,
                fillOpacity: 0.1
            }).bindPopup('<h2>' +
                zona.zona + '</h2><p>Informacion acerca del marcador: </p><ul><li>Tipo zona: '
                + zona.tipos_zona.tipo_zona
                + '</li><li>Fecha inicio: ' + ParseadorDeFecha.parsearValor(zona.validity[0].value)
                + '</li><li>Fecha fin: ' + ParseadorDeFecha.parsearValor(zona.validity[1].value) +
                '</li></ul>'
            )
            polygons.push(polygon);
        }
        return polygons
    }

}

class DataOnMapControllerTrayecto extends DataOnMapController {

    makeVisualDataByData(trayectos) {
        let linestring;
        const linestrings = new Array()
        for (const trayecto of trayectos) {
            linestring = L.polyline(trayecto.curva.coordinates, 
                { color: trayecto.tipos_trayecto.color, dashArray: trayecto.tipos_trayecto.tipo_linea, weight: trayecto.tipos_trayecto.linea }
                ).bindPopup(
                '<h2>' + trayecto.trayecto +
                '</h2><p>Informacion acerca del marcador: </p><ul><li>Tipo Trayecto: '
                + trayecto.tipos_trayecto.tipo_trayecto
                + '</li><li>Fecha inicio: ' + ParseadorDeFecha.parsearValor(trayecto.validity[0].value)
                + '</li><li>Fecha fin: ' + ParseadorDeFecha.parsearValor(trayecto.validity[1].value) +
                '</li></ul>'
            )
            linestrings.push(linestring);
        }
        return linestrings
    }

}