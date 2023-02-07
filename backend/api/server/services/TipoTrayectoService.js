import database from "../src/models";
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getPagination = (page, size) => {
  const limit = size;
  const offset = (page - 1) * size;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: results } = data;
  const currentPage = page ? +page : 0;
  const last = Math.ceil(totalItems / limit);

  return { totalItems, results, last, currentPage };
};

class TipoTrayectoService {
  static async getAllTipoTrayectos() {
    try {
      return await database.tipos_trayectos.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async search(text) {
    try {
      return await database.tipos_trayectos.findAll({
        where: {
          tipo_trayecto:
           {
            [Sequelize.Op.like]: "%"+text.toLowerCase()+"%"
        }
          }
      });
    } catch (error) {
      throw error;
    }
  }

  static async getTipoTrayectoByName(name){
    try{
      return await database.tipos_trayectos.findOne({
        where: {tipo_trayecto: name}
      })
    }catch (e) {
      throw e
    }
  }

  static async addTipoTrayecto(newTipoTrayecto) {
    try {
      return await database.tipos_trayectos.create(newTipoTrayecto);
    } catch (error) {
      error.message = "Ya existe un Tipo Trayecto con ese nombre. Por favor, cambie el nombre."
      throw error;
    }
  }

  static async updateTipoTrayecto(id, updateTipoTrayecto) {
    try {
      const TipoTrayectoToUpdate = await database.tipos_trayectos.findOne({
        where: { id: Number(id) },
      });

      if (updateTipoTrayecto) {
        await database.tipos_trayectos.update(updateTipoTrayecto, {
          where: { id: Number(id) },
        });
        return updateTipoTrayecto;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async getTipoTrayecto(id) {
    try {
      const theTipoTrayecto = await database.tipos_trayectos.findOne({
        where: { id: Number(id) },
      });
      return theTipoTrayecto;
    } catch (error) {
      throw error;
    }
  }

  static async deleteTipoTrayecto(id) {
    try {
      const TipoTrayectoToDelete = await database.tipos_trayectos.findOne({
        where: { id: Number(id) },
      });

      if (TipoTrayectoToDelete) {
        return await database.tipos_trayectos.destroy({
          where: { id: Number(id) },
        });
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async updateTipoTrayecto(id, updateTipoTrayecto) {
    try {
      const tipoTrayectoToUpdate = await database.tipos_trayectos.findOne({
        where: { id: Number(id) },
      });
      if (!tipoTrayectoToUpdate) {
        throw new Error('No se encontró el Tipo Trayecto a actualizar.');
      }

      if (updateTipoTrayecto) {
        await database.tipos_trayectos.update(updateTipoTrayecto, {
          where: { id: Number(id) },
        });
        return updateTipoTrayecto;
      }
      return null;
    } catch (error) {
      if (error.original.constraint == "tipos_trayectos_tipo_trayecto_key")
        error.message = "Ya existe un Tipo Trayecto con ese nombre. Por favor, cambie el nombre."
      throw error;
    }
  }

  static async GetTipoTrayectoByPage(page, size, title) {
    try {
      var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
      const { limit, offset } = getPagination(page, size);
      const resultado = await database.tipos_trayectos.findAndCountAll({
        // where: {
        //   id_proyecto: !null
        // }, limit, offset, include: [{ model: database.proyectos, as: 'proyecto' }],
         order: [
          ['tipo_trayecto', 'ASC'],
        ], limit, offset,
      }).then(data => {
        return getPagingData(data, page, limit)
      })
      return resultado
    } catch (error) {
      throw error
    }
  }
}

export default TipoTrayectoService;
