import TipoTrayectoService from "../services/TipoTrayectoService";
import Util from "../utils/Utils";

const util = new Util();

class TipoTrayectoController {
  static async getAllTipoTrayectos(req, res) {
    try {
      const allTiposTrayectos = await TipoTrayectoService.getAllTipoTrayectos();
      if (allTiposTrayectos.length > 0) {
        util.setSuccess(200, "Tipos de trayectos encontrados", allTiposTrayectos);
      } else {
        util.setSuccess(200, "No se encontró nungún tipo de trayecto");
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
      const allTiposTrayectos = await TipoTrayectoService.search(text);
      if (allTiposTrayectos.length > 0) {
        util.setSuccess(200, "Tipos de trayectos encontrados", allTiposTrayectos);
      } else {
        util.setSuccess(200, "No se encontró nungún tipo de trayecto");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getTipoTrayecto(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Por favor ingrese un valor numérico');
      return util.send(res);
    }

    try {
      const theTipoTrayecto = await TipoTrayectoService.getTipoTrayecto(id);
      if (!theTipoTrayecto) {
        util.setError(404, `No se pudo encontrar el TipoTrayecto con id ${id}`);
      } else {
        util.setSuccess(200, 'TipoTrayecto encontrado', theTipoTrayecto);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }
  

  static async addTipoTrayecto(req, res) {
    if (!req.body.tipo_trayecto) {
      util.setError(400, "Por favor introduzca todos los detalles");
      return util.send(res);
    }
    const newTipoTrayecto = req.body;

    try {
      const createdTipoTrayecto = await TipoTrayectoService.addTipoTrayecto(newTipoTrayecto);
      util.setSuccess(200, "Tipo de Trayecto agregado", createdTipoTrayecto);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async updateTipoTrayecto(req, res) {
 
    const theTipoTrayecto = req.body;
    if (!Number(theTipoTrayecto.id)) {
      util.setError(400, "Por favor ingrese un valor numérico");
      return util.send(res);
    }

    try {
      const updatedTipoTrayecto = await TipoTrayectoService.updateTipoTrayecto(theTipoTrayecto.id, theTipoTrayecto);
      util.setSuccess(200, "Tipo Trayecto actualizado", updatedTipoTrayecto);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }

  }

  static async getTipoTrayectoByPage(req, res) {
    try {
      const { page, size, title } = req.query;
      const TipoTrayectoPaginados = await TipoTrayectoService.GetTipoTrayectoByPage(page, size, title);
      util.setSuccess(200, 'Tipo Trayecto Paginados', TipoTrayectoPaginados);
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  };
  
}

export default TipoTrayectoController;
