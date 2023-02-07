import TipoZonaService from "../services/TipoZonaService";
import Util from "../utils/Utils";

const util = new Util();

class TipoZonaController {
  static async getAllTipoZonas(req, res) {
    try {
      const allTiposZonas = await TipoZonaService.getAllTipoZonas();
      if (allTiposZonas.length > 0) {
        util.setSuccess(200, "Tipos de Zonas encontrados", allTiposZonas);
      } else {
        util.setSuccess(200, "No se encontró ningún tipo de zona");
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
      const allTiposZonas = await TipoZonaService.search(text);
      if (allTiposZonas.length > 0) {
        util.setSuccess(200, "Tipos de Zonas encontrados", allTiposZonas);
      } else {
        util.setSuccess(200, "No se encontró ningún tipo de zona");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getTipoZona(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Por favor ingrese un valor numérico');
      return util.send(res);
    }

    try {
      const theTipoZona = await TipoZonaService.getTipoZona(id);
      if (!theTipoZona) {
        util.setError(404, `No se pudo encontrar un TipoZona con el id ${id}`);
      } else {
        util.setSuccess(200, 'TipoZona encontrado', theTipoZona);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async addTipoZona(req, res) {
    if (!req.body.tipo_zona) {
      util.setError(400, "Por favor introduzca todos los detalles");
      return util.send(res);
    }
    const newTipoZona = req.body;

    try {
      const createdTipoZona = await TipoZonaService.addTipoZona(newTipoZona);
      util.setSuccess(200, "Tipo de Zona agregado", createdTipoZona);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async updateTipoZona(req, res) {
 
    const theTipoZona = req.body;
    if (!Number(theTipoZona.id)) {
      util.setError(400, "Por favor ingrese un valor numérico");
      return util.send(res);
    }

    try {
      const updatedTipoZona = await TipoZonaService.updateTipoZona(theTipoZona.id, theTipoZona);
      util.setSuccess(200, "Tipo Zona actualizado", updatedTipoZona);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }

  }

  static async getTipoZonaByPage(req, res) {
    try {
      const { page, size, title } = req.query;
      const TipoZonaPaginados = await TipoZonaService.GetTipoZonaByPage(page, size, title);
      util.setSuccess(200, 'Tipo Zona Paginados', TipoZonaPaginados);
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  };
}

export default TipoZonaController;
