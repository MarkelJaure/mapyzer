import TipoLugarService from "../services/TipoLugarService";
import Util from "../utils/Utils";

const util = new Util();

class TipoLugarController {
  static async getAllTipoLugares(req, res) {
    try {
      const allTiposLugares = await TipoLugarService.getAllTipoLugares();
      if (allTiposLugares.length > 0) {
        util.setSuccess(200, "Tipos de lugares encontrados", allTiposLugares);
      } else {
        util.setSuccess(200, "No se encontró ningún tipo de lugar");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async search(req, res) {
    try {
      const { text } = req.params;
      const allTiposLugares = await TipoLugarService.search(text);
      if (allTiposLugares.length > 0) {
        util.setSuccess(200, "Tipos de lugares encontrados", allTiposLugares);
      } else {
        util.setSuccess(200, "No se encontró ningún tipo de lugar");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getTipoLugar(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Por favor ingrese un valor numérico');
      return util.send(res);
    }

    try {
      const theTipoLugar = await TipoLugarService.getTipoLugar(id);
      if (!theTipoLugar) {
        util.setError(404, `No se pudo encontrar el TipoLugar con id ${id}`);
      } else {
        util.setSuccess(200, 'TipoLugar encontrado', theTipoLugar);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async addTipoLugar(req, res) {
    if (!req.body.tipo_lugar) {
      util.setError(400, "Por favor introduzca todos los detalles");
      return util.send(res);
    }
    const newTipoLugar = req.body;

    try {
      const createdTipoLugar = await TipoLugarService.addTipoLugar(newTipoLugar);
      util.setSuccess(200, "Tipo de lugar agregado", createdTipoLugar);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async updateTipoLugar(req, res) {
 
    const theTipoLugar = req.body;
    if (!Number(theTipoLugar.id)) {
      util.setError(400, "Por favor ingrese un valor numérico");
      return util.send(res);
    }

    try {
      const updatedTipoLugar = await TipoLugarService.updateTipoLugar(theTipoLugar.id, theTipoLugar);
      util.setSuccess(200, "Tipo Lugar actualizado", updatedTipoLugar);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }

  }

  static async getTipoLugarByPage(req, res) {
    try {
      const { page, size, title } = req.query;
      const TipoLugarPaginados = await TipoLugarService.GetTipoLugarByPage(page, size, title);
      util.setSuccess(200, 'Tipo Lugar Paginados', TipoLugarPaginados);
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  };
}

export default TipoLugarController;
