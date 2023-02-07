import LugarService from "../services/LugarService";
import Util from "../utils/Utils";

const util = new Util();

class LugarController {
  static async getAllLugares(req, res) {
    try {
      const allLugares = await LugarService.getAllLugares();
      if (allLugares.length > 0) {
        util.setSuccess(200, "Lugares encontrados", allLugares);
      } else {
        util.setSuccess(200, "No se encontró ningún Lugar");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getLugarWithDir(req, res) {
    const { withDir, proyectoId, isvalid } = req.query;
    const isWithDir = withDir === '0';

    try {
      const lugares = await LugarService.getLugares(isWithDir, proyectoId, isvalid);
      if (lugares.length > 0) {
        util.setSuccess(
          200,
          "Lugares encontrados",
          lugares)
      } else {
        util.setSuccess(
          200,
          "No se encontró ningún Lugar");
      }
      return util.send(res)
    } catch (e) {
      util.setError(400, e);
      return util.send(res);
    }
  }

  static async getLugaresByDate(req, res) {
    try {
      const { fecha } = req.query
      const allLugares = await LugarService.getLugaresByDate(fecha);
      if (allLugares.length > 0) {
        util.setSuccess(200, "Lugares encontrados", allLugares);
      } else {
        util.setSuccess(200, "No se encontró ningún Lugar");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getLugaresByPage(req, res) {
    try {
      const { page, size, lugar, fecha } = req.query;
      const lugaresPaginados = await LugarService.GetLugaresByPage(page, size, lugar, fecha);
      util.setSuccess(200, 'Lugares Paginados', lugaresPaginados);
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getLugaresByProyectoByPage(req, res) {
    try {
      const { page, size, id, lugar, fecha, esquema, isvalid } = req.query;
      const lugaresPaginados = await LugarService.getLugaresByProyectoByPage(page, size, id, lugar, fecha, esquema,isvalid);
      util.setSuccess(200, 'Lugares Paginados del proyecto ' + id, lugaresPaginados);
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getPertenece(req, res) {
    try {
      const pertenece = await LugarService.getPertenece()
      if (pertenece.length > 0) {
        util.setSuccess(200, "Pertenecen a", pertenece);
      } else {
        util.setSuccess(200, "PEr");
      }

      return util.send(res)
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async getLugarByCode(req, res) {
    const { codigo } = req.params;

    if (!String(codigo)) {
      util.setError(400, "Por favor ingrese un valor numérico");
      return util.send(res);
    }

    try {
      const theLugar = await LugarService.getLugarByCode(codigo);
      if (!theLugar) {
        util.setError(501, `No se puede encontrar un lugar con código ${codigo}`);
      } else {
        util.setSuccess(200, "Lugar encontrado", theLugar);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async copyLugares(req, res) {

    const newLugares = req.body;
    const lugaresToAdd = []
    const { proyectoId } = req.params;

    try {

      for (let i = 0; i < newLugares.length; i++) {
        lugaresToAdd[i] = await LugarService.getLugar(newLugares[i]);
        const newlugar = await LugarService.addCopyLugar(lugaresToAdd[i], proyectoId);
      }

      if (lugaresToAdd.length > 0) {
        util.setSuccess(
          200,
          "Lugares copiados",
          lugaresToAdd)
      } else {
        util.setSuccess(
          200,
          "No se copió ningún Lugar");
      }
      return util.send(res)
    } catch (e) {
      util.setError(400, e);
      return util.send(res);
    }
  }

  static async deleteLugares(req, res) {
    const oldLugares = req.body;
    const lugaresToDelete = []
    const { proyectoId } = req.params;

    try {

      for (const idLugar of oldLugares) {
        //const lugarDeleted = await LugarService.deleteLugarFromProyectoHard(idLugar, proyectoId);
        const lugarDeletedSoft = await LugarService.deleteLugarFromProyectoSoft(idLugar);
        lugaresToDelete.push(lugarDeletedSoft)
      }

      if (lugaresToDelete.length > 0) {
        util.setSuccess(
          200,
          "Lugares eliminados",
          lugaresToDelete)
      } else {
        util.setSuccess(
          200,
          "No se elimino ningún Lugar");
      }
      return util.send(res)
    } catch (e) {
      util.setError(400, e);
      return util.send(res);
    }
  }

  static async addLugar(req, res) {
    if (!req.body.lugar || !req.body.punto) {
      util.setError(400, "Por favor introduzca todos los detalles");
      return util.send(res);
    }

    const newLugar = req.body;
    const { proyectoId } = req.params;

    if (Number.isNaN(Number(newLugar.punto.coordinates[0])) || Number.isNaN(Number(newLugar.punto.coordinates[1]))) {
      util.setError(503, "Las coordenadas deben ser números");
      return util.send(res);
    }

    if (newLugar.punto.coordinates[0] < -90 || newLugar.punto.coordinates[0] > 90) {
      util.setError(502, 'La latitud debe ser entre -90 y 90')
      return util.send(res)
    }
    if (newLugar.punto.coordinates[1] < -180 || newLugar.punto.coordinates[1] > 180) {
      util.setError(502, 'La longitud debe ser entre -180 y 180')
      return util.send(res)
    }

    if (newLugar.tipos_lugare)
      newLugar.id_tipo_lugar = newLugar.tipos_lugare.id

    newLugar.punto["crs"] = { "type": "name", "properties": { "name": "EPSG:4326" } };

    if (newLugar.validity && (newLugar.validity[0].value && newLugar.validity[1].value)) {
      if (newLugar.validity[1].value < (newLugar.validity[0].value)) {
        util.setError(505, "Fecha Desde debe ser menor o igual a Fecha Hasta");
        util.send(res);
      }
    }

    try {
      const createdLugar = await LugarService.addLugar(newLugar, proyectoId);
      util.setSuccess(200, "Lugar agregado", createdLugar);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async getLugar(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, "Por favor ingrese un valor numérico");
      return util.send(res);
    }

    try {
      const theLugar = await LugarService.getLugar(id);
      if (!theLugar) {
        util.setError(501, `No se puede encontrar un lugar con id ${id}`);
      } else {
        util.setSuccess(200, "Lugar encontrado", theLugar);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }


  static async updateLugar(req, res) {
    if (!req.body.lugar || !req.body.punto) {
      util.setError(400, "Por favor introduzca todos los detalles");
      return util.send(res);
    }
    const newLugar = req.body;

    if (!Number(newLugar.id)) {
      util.setError(400, "Por favor ingrese un valor numérico");
      return util.send(res);
    }

    if (Number.isNaN(Number(newLugar.punto.coordinates[0])) || Number.isNaN(Number(newLugar.punto.coordinates[1]))) {
      util.setError(503, "Las coordenadas deben ser números");
      return util.send(res);
    }

    if (newLugar.punto.coordinates[0] < -90 || newLugar.punto.coordinates[0] > 90) {
      util.setError(502, 'La latitud debe ser entre -90 y 90')
      return util.send(res)
    }
    if (newLugar.punto.coordinates[1] < -180 || newLugar.punto.coordinates[1] > 180) {
      util.setError(502, 'La longitud debe ser entre -180 y 180')
      return util.send(res)
    }

    if (newLugar.validity && (newLugar.validity[0].value && newLugar.validity[1].value)) {
      if (newLugar.validity[1].value < (newLugar.validity[0].value)) {
        util.setError(505, "Fecha Desde debe ser menor o igual a Fecha Hasta");
        util.send(res);
      }
    }

    newLugar.punto["crs"] = { "type": "name", "properties": { "name": "EPSG:4326" } };
    if (newLugar.tipos_lugare) {
      if (newLugar.tipos_lugare.id) {
        newLugar.id_tipo_lugar = newLugar.tipos_lugare.id
      } else {
        util.setError(505, "Lugar debe tener un TipoLugar");
        util.send(res);
      }
    }

    try {
      const createdLugar = await LugarService.updateLugar(newLugar.id, newLugar);
      util.setSuccess(200, "Lugar actualizado", createdLugar);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

}

export default LugarController;
