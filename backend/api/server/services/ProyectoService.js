import database from "../src/models";
import Sequelize from "sequelize";
import UsuarioService from "./UsuarioService";
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

class ProyectoService {
  static async getAllProyectos() {
    try {
      return await database.proyectos.findAll({
        order: [
          ['timegen', 'DESC'],
          ['id', 'ASC'],
        ],
        include: [{ model: database.usuarios, as: 'usuario' }],

      });
    } catch (error) {
      throw error;
    }
  }

  static async getAllProyectosByIDs(idProyectos) {
    try {
      var proyectos = new Array();
      for (let proyectoId of idProyectos) {
        if (!Number.isNaN(Number(proyectoId)) && !proyectos.includes(Number(proyectoId))) {
          proyectos.push(Number(proyectoId))
        }
      }

      proyectos.sort()

      return await database.proyectos.findAll({
        include: [
          { model: database.usuarios, as: 'usuario', attributes: ['id', 'username'] },
          { model: database.lugares, as: 'lugares', required: false, where: { isvalid: 'true' }, include: [{ model: database.tipos_lugares }] },
          { model: database.zonas, as: 'zonas', required: false, where: { isvalid: 'true' }, include: [{ model: database.tipos_zonas }] },
          { model: database.trayectos, as: 'trayectos', required: false, where: { isvalid: 'true' }, include: [{ model: database.tipos_trayectos }] },
        ],
        where: {
          id: {
            [Sequelize.Op.in]: proyectos
          }
        },
        order: [
          ['id', 'ASC'],
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  static async getProyectoByNombre(nombre) {
    try {
      return await database.proyectos.findOne({
        where: {
          proyecto: nombre,
        },
      })
    } catch (error) {
      throw error
    }
  }

  static async getProyectoByNombreAndUsername(nombre, username) {
    try {
      const usuario = await UsuarioService.findUserByUsername(username);

      return await database.proyectos.findOne({
        where: {
          proyecto: nombre,
          id_usuario: usuario.id,
        },

      })
    } catch (error) {
      throw error
    }
  }

  static async GetProyectosByPage(page, size, title, isValid) {
    try {
      const isValidCond = (isValid !== 'null') ? { isvalid: isValid } : null;
      const { limit, offset } = getPagination(page, size);
      return await database.proyectos.findAndCountAll({
        where: {
          [Op.and]: [{ visibilidad: "publico" }, isValidCond],
        }, limit, offset, include: [{ model: database.usuarios, as: 'usuario' }],
        order: [
          ['timegen', 'DESC'],
          ['id', 'ASC'],
        ],
      }).then(data => {
        return getPagingData(data, page, limit)
      })
    } catch (error) {
      throw error
    }
  }

  static async GetProyectosByUserByPage(page, size, title, idUsuario, isValid) {
    try {
      const isValidCond = (isValid !== 'null') ? { isvalid: isValid } : null;
      const { limit, offset } = getPagination(page, size);
      return await database.proyectos.findAndCountAll({
        where: {
          [Op.and]: [{ id_usuario: idUsuario }, isValidCond],
        }, limit, offset, include: [{ model: database.usuarios, as: 'usuario' }],
        order: [
          ['timegen', 'DESC'],
          ['id', 'ASC'],
        ],
      }).then(data => {
        return getPagingData(data, page, limit)
      })
    } catch (error) {
      throw error
    }
  }

  static async getProyectosByUser(idUsuario, isValid) {
    try {
      const isValidCond = (isValid !== 'null') ? { isvalid: isValid } : null;
      return await database.proyectos.findAll({
        where: {
          [Op.and]: [{ id_usuario: idUsuario }, isValidCond],
        },
        order: [
          ['timegen', 'DESC'],
          ['id', 'ASC'],
        ],
      })
    } catch (error) {
      throw error
    }
  }

  static async addProyecto(newProyecto) {
    try {
      return await database.proyectos.create(newProyecto);
    } catch (error) {
      if (error.original.column == "id_usuario")
        error.message = "No se puede crear un proyecto sin estar logueado"
      if (error.original.constraint == "proyectos_proyecto_idusuario_uk")
        error.message = "Usted ya tiene un proyecto con ese nombre. Por favor, cambie el nombre."

      throw error;
    }
  }

  static async updateProyecto(id, updateProyecto) {
    try {
      const ProyectoToUpdate = await database.proyectos.findOne({
        where: { id: Number(id) },
      });
      if (!ProyectoToUpdate) {
        throw new Error('No se encontró el Proyecto.');
      }

      if (updateProyecto) {
        await database.proyectos.update(updateProyecto, {
          where: { id: Number(id) },
        });
        return updateProyecto;
      }
      return null;
    } catch (error) {
      if (error.original.column == "id_usuario") {
        error.message = "No se puede crear un proyecto sin estar logueado"
      }
      if (error.original.constraint == "proyectos_proyecto_idusuario_uk") {
        error.message = "Usted ya tiene un proyecto con ese nombre. Por favor, cambie el nombre."
      }
      throw error;
    }
  }

  static async getProyectoAndEspecificaciones(id) {
    try {
      console.log(id)
      return await database.proyectos.findOne({
        where: { id: Number(id) },
        include: [
          { model: database.usuarios, as: 'usuario', attributes: ['id', 'username'] },
          { model: database.lugares, as: 'lugares', required: false,where: { isvalid: 'true' }, include: [{ model: database.tipos_lugares }] },
          { model: database.zonas, as: 'zonas', required: false, where: { isvalid: 'true' }, include: [{ model: database.tipos_zonas }] },
          { model: database.trayectos, as: 'trayectos', required: false, where: { isvalid: 'true' }, include: [{ model: database.tipos_trayectos }] },
        ]
      });
    } catch (error) {
      throw error;
    }
  }

  static async getProyecto(id) {
    try {
      return await database.proyectos.findOne({
        where: { id: Number(id) },
        include: [
          { model: database.usuarios, as: 'usuario', attributes: ['id', 'username'] },
        ]
      });
    } catch (error) {
      throw error;
    }
  }

  static async deleteProyecto(id) {
    try {
      const proyectoToDelete = await database.proyectos.findOne({
        where: { id: Number(id) },
      });

      if (proyectoToDelete) {
        return await database.proyectos.destroy({
          where: { id: Number(id) },
        });
      }
      return null;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  static async deleteProyectoSoft(id) {
    try {
      const proyectoToDelete = await database.proyectos.findOne({
        where: { id: Number(id) },
      });

      if (!proyectoToDelete) {
        throw new Error('No se encontró el Proyecto.');
      } else {

        proyectoToDelete.dataValues.isvalid = false;

        await database.proyectos.update(proyectoToDelete.dataValues, {
          where: { id: Number(id) },
        });
        return proyectoToDelete

      }
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  static async deleteProyectoByNombreAndUsername(proyecto, username) {
    try {
      const proyectoToDelete = await database.proyectos.findOne({
        where: { proyecto: proyecto, },
        include: [
          {
            model: database.usuarios, as: 'usuario', attributes: ['id', 'username'],
            where: { username: username },
          },
        ]

      });

      if (proyectoToDelete) {
        return await database.proyectos.destroy({
          where: { proyecto: proyecto, id_usuario: proyectoToDelete.usuario.id },
          include: [
            {
              model: database.usuarios, as: 'usuario', attributes: ['id', 'username'],
              where: { username: username },
            },
          ]
        });
      }
      return null;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  static async deleteLugarProyecto(proyectoId, lugarId) {
    const proyectoLugarToDelete = await database.proyectos_lugares.findOne({
      where: { id_proyecto: Number(proyectoId), id_lugar: Number(lugarId) },
    });
    try {
      if (proyectoLugarToDelete) {
        return await database.proyectos_lugares.destroy({
          where: { id_proyecto: Number(proyectoId), id_lugar: Number(lugarId) },
        });
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async deleteZonaProyecto(proyectoId, zonaId) {
    const proyectoZonaToDelete = await database.proyectos_zonas.findOne({
      where: { id_proyecto: Number(proyectoId), id_zona: Number(zonaId) },
    });
    try {
      if (proyectoZonaToDelete) {
        return await database.proyectos_zonas.destroy({
          where: { id_proyecto: Number(proyectoId), id_zona: Number(zonaId) },
        });
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async deleteTrayectoProyecto(proyectoId, trayectoId) {
    const proyectoTrayectoToDelete = await database.proyectos_trayectos.findOne({
      where: { id_proyecto: Number(proyectoId), id_trayecto: Number(trayectoId) },
    });
    try {
      if (proyectoTrayectoToDelete) {
        return await database.proyectos_trayectos.destroy({
          where: { id_proyecto: Number(proyectoId), id_trayecto: Number(trayectoId) },

        });
      } return null;
    } catch (error) {
      error.message("No se encontraron datos especificados. Por favor, verifique")
      throw error;
    }

  }

}

export default ProyectoService;
