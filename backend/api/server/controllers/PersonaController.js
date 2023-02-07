import PersonaService from "../services/PersonaService";
import Util from "../utils/Utils";

const util = new Util();

class PersonaController {
  static async getAllPersonas(req, res) {
    try {
      const allPersonas = await PersonaService.getAllPersonas();
      if (allPersonas.length > 0) {
        util.setSuccess(200, "Personas encontradas", allPersonas);
      } else {
        util.setSuccess(200, "No se encontró ninguna Persona");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async addPersona(req, res) {
    if (!req.body.dni) {
      util.setError(400, "Por favor introduzca todos los detalles");
      return util.send(res);
    }
    const newPersona = req.body;

    try {
      const createdPersona = await PersonaService.addPersona(newPersona);
      util.setSuccess(200, "Persona agregada", createdPersona);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async findPersonaByDNI(req, res) {
    const { dni } = req.params;

    if (!Number(dni)) {
      util.setError(400, "Por favor ingrese un valor numérico");
      return util.send(res);
    }

    try {
      const thePersona = await PersonaService.findPersonaByDNI(dni);
      if (!thePersona) {
        util.setError(501, `No se puede encontrar una Persona con dni ${dni}`);
      } else {
        util.setSuccess(200, "Persona encontrada", thePersona);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }
}

export default PersonaController;
