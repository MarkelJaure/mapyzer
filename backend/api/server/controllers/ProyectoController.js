import ProyectoService from "../services/ProyectoService"
import Util from "../utils/Utils"
import LugarService from "../services/LugarService"
import ZonaService from "../services/ZonaService"
import TrayectoService from "../services/TrayectoService"

const util = new Util();

class ProyectoController {

  static async addProyecto(req, res) {
    if (!req.body.proyecto) {
      util.setError(400, "Por favor introduzca todos los detalles");
      return util.send(res);
    }

    const newProyecto = req.body;
    if (newProyecto.usuario) {
      newProyecto.id_usuario = req.body.usuario.id;
    }

    try {
      const createdProyecto = await ProyectoService.addProyecto(newProyecto);

      util.setSuccess(200, "Proyecto agregado", createdProyecto);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async getAllProyectos(req, res) {
    try {
      const allProyectos = await ProyectoService.getAllProyectos();
      if (allProyectos.length > 0) {
        util.setSuccess(200, "Proyectos encontrados", allProyectos);
      } else {
        util.setSuccess(200, "No se encontró ningún proyecto");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getAllProyectosByIDs(req, res) {
    try {
      var idProyectos = req.body.idProyectos

      const allProyectosByIds = await ProyectoService.getAllProyectosByIDs(idProyectos);
      if (allProyectosByIds.length > 0) {
        util.setSuccess(200, "Proyectos encontrados", allProyectosByIds);
      } else {
        util.setSuccess(200, "No se encontró ningún proyecto");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getProyectosByPage(req, res) {
    try {
      const { page, size, title, isValid } = req.query;
      const ProyectosPaginados = await ProyectoService.GetProyectosByPage(page, size, title,isValid);
      util.setSuccess(200, 'Proyectos Paginados', ProyectosPaginados);
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  };

  static async getProyectosByUserByPage(req, res) {
    try {
      const { page, size, title, isValid } = req.query;
      const { idUsuario } = req.params
      const ProyectosPaginadosUser = await ProyectoService.GetProyectosByUserByPage(page, size, title, idUsuario,isValid);
      util.setSuccess(200, 'Proyectos Paginados del usuario ' + idUsuario, ProyectosPaginadosUser);
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  };

  static async getProyectosByUser(req, res) {
    try {
      const { isValid } = req.query
      const { idUsuario } = req.params
      const proyectosByUser = await ProyectoService.getProyectosByUser(idUsuario,isValid);
      util.setSuccess(200, 'Proyectos del usuario ' + idUsuario, proyectosByUser);
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getProyecto(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Por favor ingrese un valor numérico');
      return util.send(res);
    }

    try {
      const theProyecto = await ProyectoService.getProyecto(id);
      if (!theProyecto) {
        util.setError(404, `No se puede encontrar un proyecto con id ${id}`);
      } else {
        util.setSuccess(200, 'Proyecto encontrado', theProyecto);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async getProyectoByNombre(req, res) {
    const { nombre } = req.params;

    try {
      const theProyecto = await ProyectoService.getProyectoByNombre(nombre);
      if (!theProyecto) {
        util.setError(404, `No se puede encontrar un proyecto con nombre ${nombre}`);
      } else {
        util.setSuccess(200, 'Proyecto encontrado', theProyecto);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async getProyectoByNombreAndUsername(req, res) {
    const { nombre, username } = req.params;

    try {
      const theProyecto = await ProyectoService.getProyectoByNombreAndUsername(nombre,username);
      if (!theProyecto) {
        util.setError(404, `No se puede encontrar un proyecto con nombre ${nombre} y del usuario ${username}`);
      } else {
        util.setSuccess(200, 'Proyecto encontrado', theProyecto);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async getProyectoAndEspecificaciones(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Por favor ingrese un valor numérico');
      return util.send(res);
    }

    try {
      const theProyecto = await ProyectoService.getProyectoAndEspecificaciones(id);
      if (!theProyecto) {
        util.setError(404, `No se puede encontrar un proyecto con id ${id}`);
      } else {
        util.setSuccess(200, 'Proyecto encontrado', theProyecto);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async updateProyecto(req, res) {
    const theProyecto = req.body;
    if (!Number(theProyecto.id)) {
      util.setError(400, "Por favor ingrese un valor numérico");
      return util.send(res);
    }

    try {
      const updatedProyecto = await ProyectoService.updateProyecto(theProyecto.id, theProyecto);
      util.setSuccess(200, "Proyecto actualizado", updatedProyecto);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }

  }

  static async deleteLugarProyecto(req, res) {
    try {
      const { proyectoId, lugarId } = req.query;

      const lugarDeletedSoft = await LugarService.deleteLugarFromProyectoSoft(lugarId);
      if (lugarDeletedSoft) {
        util.setSuccess(200, 'El lugar se ha eliminado correctamente del proyecto', lugarDeletedSoft);
        return util.send(res);
      } else {
        util.setError(400, 'No se encontraron los datos especificados. Por favor, actualice su navegador');
        return util.send(res);
      }
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async deleteZonaProyecto(req, res) {
    try {
      const { proyectoId, zonaId } = req.query;

      const zonaDeletedSoft = await ZonaService.deleteZonaFromProyectoSoft(zonaId);
      if (zonaDeletedSoft) {
        util.setSuccess(200, 'La zona se ha eliminado correctamente del proyecto', zonaDeletedSoft);
        return util.send(res);
      } else {
        util.setError(400, 'No se encontraron los datos especificados. Por favor, actualice su navegador');
        return util.send(res);
      }
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  };

  static async deleteTrayectoProyecto(req, res) {
    try {
      const { proyectoId, trayectoId } = req.query;

      const trayectoDeletedSoft = await TrayectoService.deleteTrayectoFromProyectoSoft(trayectoId);
      if (trayectoDeletedSoft) {
        util.setSuccess(200, 'El trayecto se ha eliminado correctamente del proyecto', trayectoDeletedSoft);
        return util.send(res);
      } else {
        util.setError(400, 'No se encontraron los datos especificados. Por favor, actualice su navegador');
        return util.send(res);
      }
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  };

  static async deleteProyectoSoft(req, res) {
    try {
      const {idProyecto} = req.query;

      if (!Number(idProyecto)) {
        util.setError(400, "Por favor ingrese un valor numérico");
        return util.send(res);
      }

      const proyectoToDelete = await ProyectoService.deleteProyectoSoft(idProyecto);

      if (proyectoToDelete) {
        util.setSuccess(200, 'Proyecto dado de baja', proyectoToDelete);
        return util.send(res);
      } else {
        util.setError(400, 'No se encontro el proyecto especificado');
        return util.send(res);
      }
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async deleteProyectoHardByNombreAndUsername(req, res) {
    try {
      const {proyecto,username} = req.query;

      const proyectoToDelete = await ProyectoService.deleteProyectoByNombreAndUsername(proyecto,username);

      if (proyectoToDelete) {
        util.setSuccess(200, 'Proyecto eliminado completamente', proyectoToDelete);
        return util.send(res);
      } else {
        util.setError(400, 'No se encontro el proyecto especificado');
        return util.send(res);
      }
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

}

export default ProyectoController;
