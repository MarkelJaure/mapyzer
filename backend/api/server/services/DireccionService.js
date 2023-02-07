import database from '../src/models';
import LugarService from "./LugarService";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

class DireccionService {
    static async addDireccion(newDireccion, proyecto_id) {
        try {
            newDireccion.procesado = false
            newDireccion.proyecto_id = Number(proyecto_id)
            return await database.direcciones.create(newDireccion);
        } catch (e) {
            throw e;
        }
    }

    static async updateDirection(direction) {
        try {
            const dirToUpdate = await database.direcciones.findOne({
                where: {id: Number(direction.id)}
            })
            if (!dirToUpdate) {
                throw new Error('No direction found!')
            }

            if (dirToUpdate) {
                await database.direcciones.update({procesado: true}, {
                    where: {id: Number(direction.id)}
                });
                console.log("Se actualiza" + direction.id)
                return direction
            }
            return null;
        } catch (e) {
            throw e;
        }
    }

    static async getDirUnprceced() {
        try {
            return await database.direcciones.findOne({
                where: {
                    procesado: {[Op.not]: true}
                }
            })
        } catch (e) {
            throw e
        }
    }

    static async addDirecciones(direcciones) {
        try {
            return await database.direcciones.bulkCreate(direcciones)
        } catch (e) {
            throw e;
        }
    }
}

export default DireccionService
