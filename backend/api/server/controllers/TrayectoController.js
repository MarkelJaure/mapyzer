import TrayectoService from "../services/TrayectoService"
import Util from '../utils/Utils'
const db = require("../src/models");

const util = new Util()

class TrayectoController {
    static async getAllTrayectos(req, res) {
        try {
            const allTrayectos = await TrayectoService.getAllTrayectos();
            if (allTrayectos.length > 0) {
                util.setSuccess(200, 'Trayectos encontrados', allTrayectos);
            } else {
                util.setSuccess(200, 'No se encontró ningún Trayecto');
            }
            return util.send(res);
        } catch (error) {
            util.setError(400, error);
            return util.send(res);
        }
    }

    static async getTrayectosByPage(req, res) {
        try {
            const { page, size, trayecto, fecha } = req.query;
            const TrayectosPaginados = await TrayectoService.GetTrayectosByPage(page, size, trayecto, fecha);
            util.setSuccess(200, 'Trayectos Paginadas', TrayectosPaginados);
            return util.send(res);
        } catch (error) {
            util.setError(400, error);
            return util.send(res);
        }
    };

    static async getTrayecto(req, res) {
        const { id } = req.params;

        if (!Number(id)) {
            util.setError(400, 'Por favor ingrese un valor numérico');
            return util.send(res);
        }

        try {
            const theTrayecto = await TrayectoService.getTrayecto(id);
            if (!theTrayecto) {
                util.setError(501, `No se pudo encontrar un Trayecto con el id ${id}`);
            } else {
                util.setSuccess(200, 'Trayecto encontrado', theTrayecto);
            }
            return util.send(res);
        } catch (error) {
            util.setError(404, error);
            return util.send(res);
        }
    }

    static async getByProyecto(req, res){
        try {
            const {id, isvalid} = req.query
            const trayectos = await TrayectoService.getByProyecto(id, isvalid)
            if (trayectos.length > 0) {
                util.setSuccess(200, 'Trayecto encontradas', trayectos);
            } else {
                util.setSuccess(200, 'No se encontró ningun trayecto');
            }
            return util.send(res);
        } catch (e) {
            util.setError(400, error);
            return util.send(res);
        }
    }

    static async getTrayectoByCodigo(req, res) {
        const { codigo } = req.params;

        try {
            const theTrayecto = await TrayectoService.getTrayectoByCodigo(codigo);
            if (!theTrayecto) {
                util.setError(501, `No se pudo encontrar Trayecto con el código ${codigo}`);
            } else {
                util.setSuccess(200, 'Trayecto encontrado', theTrayecto);
            }
            return util.send(res);
        } catch (error) {
            util.setError(404, error);
            return util.send(res);
        }
    }

    static async getTrayectosByProyectoByPage(req, res) {
        try {
            const { page, size, id, lugar, fecha, isvalid } = req.query;
            const trayectosPaginados = await TrayectoService.getTrayectosByProyectoByPage(page, size, id, lugar, fecha, isvalid);
            util.setSuccess(200, 'Trayectos Paginadas del proyecto ' + id, trayectosPaginados);
            return util.send(res);
        } catch (error) {
            util.setError(400, error);
            return util.send(res);
        }
    };


    static async addTrayecto(req, res) {


        if (!req.body.trayecto) {
            util.setError(400, 'Por favor introduzca todos los detalles')
            return util.send(res)
        }

        const newTrayecto = req.body
        const { proyectoId } = req.params;
        const length = newTrayecto.curva.coordinates.length

        if (length < 2) {
            util.setError(502, 'Insertar mínimo 2 coordenadas')
            return util.send(res)
        }

        for (let coordinate of newTrayecto.curva.coordinates) {

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
            if ((newTrayecto.curva.coordinates[i][0] == null) || (newTrayecto.curva.coordinates[i][1] == null)) {
                util.setError(503, 'No se aceptan coordenadas nulas')
                return util.send(res)
            }
            for (var j = i + 1; j < length; j++) {
                if ((j != i) && ((newTrayecto.curva.coordinates[i][0] == newTrayecto.curva.coordinates[j][0]) && (newTrayecto.curva.coordinates[i][1] == newTrayecto.curva.coordinates[j][1]))) {
                    contador++
                    break;
                }
            }
        }
        if (newTrayecto.curva.coordinates.length - contador < 2) {
            util.setError(503, 'Insertar al menos 2 coordenadas distintas')
            return util.send(res)
        }



        if (newTrayecto.tipos_trayecto)
            newTrayecto.id_tipo_trayecto = newTrayecto.tipos_trayecto.id

        newTrayecto.curva["crs"] = { "type": "name", "properties": { "name": "EPSG:4326" } };
        newTrayecto.curva["type"] = "LineString"

        if (newTrayecto.validity && (newTrayecto.validity[0].value && newTrayecto.validity[1].value)) {
            if (newTrayecto.validity[1].value < (newTrayecto.validity[0].value)) {
                util.setError(505, "Fecha Desde debe ser menor o igual que Fecha Hasta");
                return util.send(res);
            }
        }

        try {
            const createdTrayecto = await TrayectoService.addTrayecto(newTrayecto, proyectoId)
            util.setSuccess(200, 'Trayecto agregado', createdTrayecto)
            return util.send(res)
        } catch (error) {
            util.setError(400, error.message)
            return util.send(res)
        }
    }

    static async udpateTrayecto(req, res) {


        if (!req.body.trayecto) {
            util.setError(400, 'Por favor introduzca todos los detalles')
            return util.send(res)
        }

        const newTrayecto = req.body
        const { proyectoId } = req.params;
        const length = newTrayecto.curva.coordinates.length

        if (length < 2) {
            util.setError(502, 'Insertar mínimo 2 coordenadas')
            return util.send(res)
        }

        for (let coordinate of newTrayecto.curva.coordinates) {

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
            if ((newTrayecto.curva.coordinates[i][0] == null) || (newTrayecto.curva.coordinates[i][1] == null)) {
                util.setError(503, 'No se aceptan coordenadas nulas')
                return util.send(res)
            }
            for (var j = i + 1; j < length; j++) {
                if ((j != i) && ((newTrayecto.curva.coordinates[i][0] == newTrayecto.curva.coordinates[j][0]) && (newTrayecto.curva.coordinates[i][1] == newTrayecto.curva.coordinates[j][1]))) {
                    contador++
                    break;
                }
            }
        }
        if (newTrayecto.curva.coordinates.length - contador < 2) {
            util.setError(503, 'Insertar al menos 2 coordenadas distintas')
            return util.send(res)
        }



        if (newTrayecto.tipos_trayecto)
            newTrayecto.id_tipo_trayecto = newTrayecto.tipos_trayecto.id

        newTrayecto.curva["crs"] = { "type": "name", "properties": { "name": "EPSG:4326" } };
        newTrayecto.curva["type"] = "LineString"

        if (newTrayecto.validity && (newTrayecto.validity[0].value && newTrayecto.validity[1].value)) {
            if (newTrayecto.validity[1].value < (newTrayecto.validity[0].value)) {
                util.setError(505, "Fecha Desde debe ser menor o igual que Fecha Hasta");
                util.send(res);
            }
        }

        try {
            const createdTrayecto = await TrayectoService.updateTrayecto(newTrayecto.id, newTrayecto)
            util.setSuccess(200, 'Trayecto actualizado', createdTrayecto)
            return util.send(res)
        } catch (error) {
            util.setError(400, error.message)
            return util.send(res)
        }
    }

    static async copyTrayectos(req, res) {

        const newTrayectos = req.body;
        const trayectosToAdd = []
        const { proyectoId } = req.params;
    
        try {
    
          for (let i = 0; i < newTrayectos.length; i++) {
            trayectosToAdd[i] = await TrayectoService.getTrayecto(newTrayectos[i]);
            const newTrayecto = await TrayectoService.addCopyTrayecto(trayectosToAdd[i], proyectoId);
          }
    
          if (trayectosToAdd.length > 0) {
            util.setSuccess(
              200,
              "Trayectos copiados",
              trayectos)
          } else {
            util.setSuccess(
              200,
              "No se copió ningún Trayecto");
          }
          return util.send(res)
        } catch (e) {
          util.setError(400, e);
          return util.send(res);
        }
      }

      static async deleteTrayectos(req, res) {
        const oldTrayectos = req.body;
        const trayectosToDelete = []
        const { proyectoId } = req.params;
    
        try {
    
          for (const idTrayecto of oldTrayectos) {
            const trayectoDeletedSoft = await TrayectoService.deleteTrayectoFromProyectoSoft(idTrayecto);
            trayectosToDelete.push(trayectoDeletedSoft)
          }
    
          if (trayectosToDelete.length > 0) {
            util.setSuccess(
              200,
              "Trayectos eliminados",
              trayectosToDelete)
          } else {
            util.setSuccess(
              200,
              "No se elimino ningún Trayecto");
          }
          return util.send(res)
        } catch (e) {
          util.setError(400, e);
          return util.send(res);
        }
      }
}

export default TrayectoController
