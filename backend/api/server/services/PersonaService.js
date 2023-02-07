import database from "../src/models";

class PersonaService {
  static async getAllPersonas() {
    try {
      return await database.personas.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async addPersona(newPersona) {
    try {
      return await database.personas.create(newPersona);
    } catch (error) {
      throw error;
    }
  }

  static async updatePersona(id, updatePersona) {
    try {
      const PersonaToUpdate = await database.personas.findOne({
        where: { id: Number(id) },
      });
      if (updatePersona) {
        await database.personas.update(updatePersona, {
          where: { id: Number(id) },
        });
        return updatePersona;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async findPersonaByDNI(dni) {
    try {
        const thePersona = await database.personas.findOne({
            where: {dni: Number(dni)}
        });
        return thePersona;
    } catch (error) {
        throw error;
    }
}

  static async getPersona(id) {
    try {
      const thePersona = await database.personas.findOne({
        where: { id: Number(id) },
      });
      return thePersona;
    } catch (error) {
      throw error;
    }
  }

  static async findPersonaByDNI(dni) {
    try {
      const thePersona = await database.personas.findOne({
        where: { dni: Number(dni) },
      });
      return thePersona;
    } catch (error) {
      throw error;
    }
  }

  static async deletePersona(id) {
    try {
      const PersonaToDelete = await database.personas.findOne({
        where: { id: Number(id) },
      });

      if (PersonaToDelete) {
        return await database.personas.destroy({
          where: { id: Number(id) },
        });
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default PersonaService;
