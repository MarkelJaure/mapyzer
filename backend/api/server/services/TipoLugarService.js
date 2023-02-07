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


class TipoLugarService {
  static async getAllTipoLugares() {
    try {
      return await database.tipos_lugares.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async search(text) {
    //UPPER(c.nombre) LIKE CONCAT('%',UPPER(:name)
    //select * from tipos_lugares c where UPPER(c.tipo_lugar) LIKE ('%IPO%')
    try {
      return await database.tipos_lugares.findAll({
        where: {
          tipo_lugar:
           {
            [Sequelize.Op.like]: "%"+text.toLowerCase()+"%"
        }
          }
      });
    } catch (error) {
      throw error;
    }
  }

  static async getTipoLugarByName(tipo_lugar) {
    try {
      return await database.tipos_lugares.findOne({
        where: {tipo_lugar: tipo_lugar},
      });
    } catch (error) {
      throw error;
    }
  }

  static async addTipoLugar(newTipoLugar) {
    try {
      return await database.tipos_lugares.create(newTipoLugar);
    } catch (error) {
      error.message = "Ya existe un Tipo Lugar con ese nombre. Por favor, cambie el nombre."
      throw error;
    }
  }

  static async updateTipoLugar(id, updateTipoLugar) {
    try {
      const TipoLugarToUpdate = await database.tipos_lugares.findOne({
        where: { id: Number(id) },
      });

      if (updateTipoLugar) {
        await database.tipos_lugares.update(updateTipoLugar, {
          where: { id: Number(id) },
        });
        return updateTipoLugar;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async getTipoLugar(id) {
    try {
      const theTipoLugar = await database.tipos_lugares.findOne({
        where: { id: Number(id) },
      });
      return theTipoLugar;
    } catch (error) {
      throw error;
    }
  }

  static async deleteTipoLugar(id) {
    try {
      const TipoLugarToDelete = await database.tipos_lugares.findOne({
        where: { id: Number(id) },
      });

      if (TipoLugarToDelete) {
        return await database.tipos_lugares.destroy({
          where: { id: Number(id) },
        });
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async updateTipoLugar(id, updateTipoLugar) {
    try {
      const tipoLugarToUpdate = await database.tipos_lugares.findOne({
        where: { id: Number(id) },
      });
      if (!tipoLugarToUpdate) {
        throw new Error('No se encontró el Tipo Lugar a actualizar.');
      }

      if (updateTipoLugar) {
        await database.tipos_lugares.update(updateTipoLugar, {
          where: { id: Number(id) },
        });
        return updateTipoLugar;
      }
      return null;
    } catch (error) {
      if (error.original.constraint == "tipos_lugar_tipo_lugar_key")
        error.message = "Ya existe un Tipo Lugar con ese nombre. Por favor, cambie el nombre."
      throw error;
    }
  }

  static async GetTipoLugarByPage(page, size, title) {
    try {
      var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
      const { limit, offset } = getPagination(page, size);
      const resultado = await database.tipos_lugares.findAndCountAll({
        // where: {
        //   id_proyecto: !null
        // }, limit, offset, include: [{ model: database.proyectos, as: 'proyecto' }],
         order: [
          ['tipo_lugar', 'ASC'],
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

export default TipoLugarService;
