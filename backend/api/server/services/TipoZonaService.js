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

class TipoZonaService {
  static async getAllTipoZonas() {
    try {
      return await database.tipos_zonas.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async search(text) {
    try {
      return await database.tipos_zonas.findAll({
        where: {
          tipo_zona:
          {
            [Sequelize.Op.like]: "%" + text.toLowerCase() + "%"
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }

  static async getTipoZonaByName(name) {
    try {
      return await database.tipos_zonas.findOne({
        where: { tipo_zona: name }
      })
    } catch (e) {
      throw e;
    }
  }

  static async addTipoZona(newTipoZona) {
    try {
      return await database.tipos_zonas.create(newTipoZona);
    } catch (error) {
      error.message = "Ya existe un Tipo Zona con ese nombre. Por favor, cambie el nombre."
      throw error;
    }
  }


  static async getTipoZona(id) {
    try {
      const theTipoZona = await database.tipos_zonas.findOne({
        where: { id: Number(id) },
      });
      return theTipoZona;
    } catch (error) {
      throw error;
    }
  }

  static async deleteTipoZona(id) {
    try {
      const TipoZonaToDelete = await database.tipos_zonas.findOne({
        where: { id: Number(id) },
      });

      if (TipoZonaToDelete) {
        return await database.tipos_zonas.destroy({
          where: { id: Number(id) },
        });
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async updateTipoZona(id, updateTipoZona) {
    try {
      const tipoZonaToUpdate = await database.tipos_zonas.findOne({
        where: { id: Number(id) },
      });
      if (!tipoZonaToUpdate) {
        throw new Error('No se encontró el Tipo Zona a actualizar.');
      }

      if (updateTipoZona) {
        await database.tipos_zonas.update(updateTipoZona, {
          where: { id: Number(id) },
        });
        return updateTipoZona;
      }
      return null;
    } catch (error) {
      if (error.original.constraint == "tipos_zona_tipo_zona_key")
        error.message = "Ya existe un Tipo Zona con ese nombre. Por favor, cambie el nombre."
      throw error;
    }
  }

  static async GetTipoZonaByPage(page, size, title) {
    try {
      var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
      const { limit, offset } = getPagination(page, size);
      const resultado = await database.tipos_zonas.findAndCountAll({
        order: [
          ['tipo_zona', 'ASC'],
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

export default TipoZonaService;
