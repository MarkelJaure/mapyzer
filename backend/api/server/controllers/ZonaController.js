import ZonaService from "../services/ZonaService"
import Util from '../utils/Utils'

const db = require("../src/models");

const util = new Util()

class ZonaController {
    static async getAllZonas(req, res) {
        try {
            const allZonas = await ZonaService.getAllZonas();
            if (allZonas.length > 0) {
                util.setSuccess(200, 'Zonas encontradas', allZonas);
            } else {
                util.setSuccess(200, 'No se encontró ninguna zona');
            }
            return util.send(res);
        } catch (error) {
            util.setError(400, error);
            return util.send(res);
        }
    }

    static async getByProyecto(req, res) {
        try {
            const { id, isvalid } = req.query
            const zonas = await ZonaService.getByProyecto(id,isvalid)
            if (zonas.length > 0) {
                util.setSuccess(200, 'Zonas encontradas', zonas);
            } else {
                util.setSuccess(200, 'No se encontró ninguna zona');
            }
            return util.send(res);
        } catch (e) {
            util.setError(400, error);
            return util.send(res);
        }
    }

    static async getZonasByPage(req, res) {
        try {
            const { page, size, zona, fecha } = req.query;
            const zonasPaginadas = await ZonaService.GetZonasByPage(page, size, zona, fecha);
            util.setSuccess(200, 'Zonas Paginadas', zonasPaginadas);
            return util.send(res);
        } catch (error) {
            util.setError(400, error);
            return util.send(res);
        }
    };

    static async getZona(req, res) {
        const { id } = req.params;

        if (!Number(id)) {
            util.setError(400, 'Por favor ingrese un valor numéricosss');
            return util.send(res);
        }

        try {
            const theZona = await ZonaService.getZona(id);
            if (!theZona) {
                util.setError(501, `No se pudo encontrar una Zona con el id ${id}`);
            } else {
                util.setSuccess(200, 'Zona encontrada', theZona);
            }
            return util.send(res);
        } catch (error) {
            util.setError(404, error);
            return util.send(res);
        }
    }

    static async getZonaByCodigo(req, res) {
        const { codigo } = req.params;

        try {
            const theZona = await ZonaService.getZonaByCodigo(codigo);
            if (!theZona) {
                util.setError(501, `No se pudo encontrar una Zona con el código ${codigo}`);
            } else {
                util.setSuccess(200, 'Found Zona', theZona);
            }
            return util.send(res);
        } catch (error) {
            util.setError(404, error);
            return util.send(res);
        }
    }

    static async getZonasByProyectoByPage(req, res) {
        try {
            const { page, size, id, lugar, fecha, isvalid } = req.query;
            const zonasPaginadas = await ZonaService.getZonasByProyectoByPage(page, size, id, lugar, fecha,isvalid);
            util.setSuccess(200, 'Zonas Paginadas del proyecto ' + id, zonasPaginadas);
            return util.send(res);
        } catch (error) {
            util.setError(400, error);
            return util.send(res);
        }
    }

    static async copyZonas(req, res) {

        const newZonas = req.body;
        const zonasToAdd = []
        const { proyectoId } = req.params;

        try {

            for (let i = 0; i < newZonas.length; i++) {
                zonasToAdd[i] = await ZonaService.getZona(newZonas[i]);
                const newZona = await ZonaService.addCopyZona(zonasToAdd[i], proyectoId);
            }

            if (zonasToAdd.length > 0) {
                util.setSuccess(
                    200,
                    "Zonas copiadas",
                    zonas)
            } else {
                util.setSuccess(
                    200,
                    "No se copió ninguna Zona");
            }
            return util.send(res)
        } catch (e) {
            util.setError(400, e);
            return util.send(res);
        }
    }

    static async deleteZonas(req, res) {
        const oldZonas = req.body;
        const zonasToDelete = []
        const { proyectoId } = req.params;

        try {

            for (const idZona of oldZonas) {
                const zonaDeletedSoft = await ZonaService.deleteZonaFromProyectoSoft(idZona);
                zonasToDelete.push(zonaDeletedSoft)
            }

            if (zonasToDelete.length > 0) {
                util.setSuccess(
                    200,
                    "Zonas eliminadas",
                    zonasToDelete)
            } else {
                util.setSuccess(
                    200,
                    "No se elimino ningún Zona");
            }
            return util.send(res)
        } catch (e) {
            util.setError(400, e);
            return util.send(res);
        }
    }

    static async addZona(req, res) {


        if (!req.body.zona) {
            util.setError(400, 'Por favor introduzca todos los detalles')
            return util.send(res)
        }

        const newZona = req.body
        const { proyectoId } = req.params;
        const length = newZona.poligono.coordinates[0].length

        if (length < 4) {
            util.setError(502, 'Insertar mínimo 4 coordenadas')
            return util.send(res)
        }

        if ((newZona.poligono.coordinates[0][0][0] != newZona.poligono.coordinates[0][length - 1][0]) || (newZona.poligono.coordinates[0][0][1] != newZona.poligono.coordinates[0][length - 1][1])) {
            util.setError(503, 'La primera coordenada debe ser igual a la última')
            return util.send(res)
        }

        for (let coordinate of newZona.poligono.coordinates[0]) {

            if (Number.isNaN(Number(coordinate[0])) || Number.isNaN(Number(coordinate[1]))) {
                util.setError(504, "Todas las coordenadas deben ser números");
                return util.send(res);
            }

            if (coordinate[0] < -90 || coordinate[0] > 90) {
                util.setError(504, 'Todas las latitudes deben ser números entre-90 y 90')
                return util.send(res)
            }
            if (coordinate[1] < -180 || coordinate[1] > 180) {
                util.setError(504, 'Todas las longitudes deben ser números entre -180 y 180')
                return util.send(res)
            }
        }

        var contador = 0
        for (var i = 0; i < length; i++) {
            if ((newZona.poligono.coordinates[0][i][0] == null) || (newZona.poligono.coordinates[0][i][1] == null)) {
                util.setError(503, 'No se aceptan coordenadas nulas')
                return util.send(res)
            }
            for (var j = i + 1; j < length; j++) {
                if ((j != i) && ((newZona.poligono.coordinates[0][i][0] == newZona.poligono.coordinates[0][j][0]) && (newZona.poligono.coordinates[0][i][1] == newZona.poligono.coordinates[0][j][1]))) {
                    contador++
                    break;
                }
            }
        }
        if (newZona.poligono.coordinates[0].length - contador < 3) {
            util.setError(503, 'Insertar al menos 3 coordenadas distintas')
            return util.send(res)
        }


        if (newZona.tipos_zona)
            newZona.id_tipo_zona = newZona.tipos_zona.id

        newZona.poligono["crs"] = { "type": "name", "properties": { "name": "EPSG:4326" } };
        newZona.poligono["type"] = "Polygon"

        if (newZona.validity && (newZona.validity[0].value && newZona.validity[1].value)) {
            if (newZona.validity[1].value < (newZona.validity[0].value)) {
                util.setError(505, "Fecha Desde debe ser menor o igual que Fecha Hasta");
                return util.send(res);
            }
        }

        try {
            const createdZona = await ZonaService.addZona(newZona, proyectoId)
            util.setSuccess(200, 'Zona agregada', createdZona)
            return util.send(res)
        } catch (error) {
            util.setError(400, error.message)
            return util.send(res)
        }
    }

    static async udpateZona(req, res) {


        if (!req.body.zona) {
            util.setError(400, 'Por favor introduzca todos los detalles')
            return util.send(res)
        }

        const newZona = req.body
        const length = newZona.poligono.coordinates[0].length

        if (length < 4) {
            util.setError(502, 'Insertar minimo 4 coordenadas')
            return util.send(res)
        }

        if ((newZona.poligono.coordinates[0][0][0] != newZona.poligono.coordinates[0][length - 1][0]) || (newZona.poligono.coordinates[0][0][1] != newZona.poligono.coordinates[0][length - 1][1])) {
            util.setError(503, 'La primera coordenada debe ser igual a la ultima')
            return util.send(res)
        }

        for (let coordinate of newZona.poligono.coordinates[0]) {

            if (Number.isNaN(Number(coordinate[0])) || Number.isNaN(Number(coordinate[1]))) {
                util.setError(504, "Todas las coordenadas deben ser numeros");
                return util.send(res);
            }

            if (coordinate[0] < -90 || coordinate[0] > 90) {
                util.setError(504, 'Todas las latitudes deben ser numeros entre-90 y 90')
                return util.send(res)
            }
            if (coordinate[1] < -180 || coordinate[1] > 180) {
                util.setError(504, 'Todas las longitudes deben ser numeros entre -180 y 180')
                return util.send(res)
            }
        }

        var contador = 0
        for (var i = 0; i < length; i++) {
            if ((newZona.poligono.coordinates[0][i][0] == null) || (newZona.poligono.coordinates[0][i][1] == null)) {
                util.setError(503, 'No se aceptan coordenadas nulas')
                return util.send(res)
            }
            for (var j = i + 1; j < length; j++) {
                if ((j != i) && ((newZona.poligono.coordinates[0][i][0] == newZona.poligono.coordinates[0][j][0]) && (newZona.poligono.coordinates[0][i][1] == newZona.poligono.coordinates[0][j][1]))) {
                    contador++
                    break;
                }
            }
        }
        if (newZona.poligono.coordinates[0].length - contador < 3) {
            util.setError(503, 'Insertar almenos 3 coordenadas distintas')
            return util.send(res)
        }


        if (newZona.tipos_zona)
            newZona.id_tipo_zona = newZona.tipos_zona.id

        newZona.poligono["crs"] = { "type": "name", "properties": { "name": "EPSG:4326" } };
        newZona.poligono["type"] = "Polygon"

        if (newZona.validity && (newZona.validity[0].value && newZona.validity[1].value)) {
            if (newZona.validity[1].value < (newZona.validity[0].value)) {
                util.setError(505, "Fecha Desde debe ser menor o igual que Fecha Hasta");
                util.send(res);
            }
        }

        try {
            const createdZona = await ZonaService.updateZona(newZona.id, newZona)
            util.setSuccess(200, 'Zona Updated', createdZona)
            return util.send(res)
        } catch (error) {
            util.setError(400, error.message)
            return util.send(res)
        }
    }
}

export default ZonaController
