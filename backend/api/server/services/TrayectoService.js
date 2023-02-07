import database from '../src/models'
const { QueryTypes } = require('sequelize');
import trayecto from "../src/models/trayecto"
import Sequelize from "sequelize";
import TipoTrayectoService from "./TipoTrayectoService";
import TipoZonaService from "./TipoZonaService";
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

class TrayectoService {
    static async getAllTrayectos() {
        try {
            return await database.trayectos.findAll({
                include: [
                    { model: database.tipos_trayectos },
                ],
            })
        } catch (error) {
            throw error
        }
    }

    static async getByProyecto(proyectoId, isValid) {
        try {
            const isValidCond = (isValid !== 'null') ? { isvalid: isValid } : null;
            return await database.trayectos.findAll({
                where:  isValidCond,
                include: [
                    {
                        model: database.proyectos,
                        as: 'proyectos',
                        attributes: ['id', 'proyecto'],
                        where: { id: Number(proyectoId) },
                    },
                    { model: database.tipos_trayectos }
                ]
            })
        } catch (e) {
            throw e
        }
    }

    static async GetTrayectosByPage(page, size, trayecto, fecha) {
        try {
            const conditionNombre = trayecto ? { trayecto: { [Op.iLike]: `%${trayecto}%` } } : null;
            const conditionFecha = fecha ? Sequelize.literal(`CAST('${fecha}' AS timestamptz) <@ validity`) : null;
            const { limit, offset } = getPagination(page, size);
            const resultado = await database.trayectos.findAndCountAll({
                where: { [Op.and]: [conditionNombre, conditionFecha] }, order: [
                    ['codigo', 'ASC'],
                    ['id', 'DESC'],
                ], limit, offset,
                include: [
                    { model: database.tipos_trayectos, attributes: ['id', 'tipo_trayecto'] },
                ],
            }).then(data => {
                return getPagingData(data, page, limit)
            })
            return resultado
        } catch (error) {
            throw error
        }
    }

    static async getTrayectosByProyectoByPage(page, size, id, trayecto, fecha, isValid) {
        try {
            const isValidCond = (isValid !== 'null') ? { isvalid: isValid } : null;
            const conditionNombre = trayecto ? { trayecto: { [Op.iLike]: `%${trayecto}%` } } : null;
            const conditionFecha = fecha ? Sequelize.literal(`CAST('${fecha}' AS timestamptz) <@ validity`) : null;
            const { limit, offset } = getPagination(page, size);

            const resultado = await database.trayectos.findAndCountAll({ where: { [Op.and]: [conditionNombre, conditionFecha, isValidCond] }, limit, offset, include: [{ model: database.proyectos, as: 'proyectos', attributes: ['id', 'proyecto'], where: { id: Number(id) }, }, { model: database.tipos_trayectos },] }).then((data) => {
                return getPagingData(data, page, limit);
            });
            return resultado;
        } catch (error) {
            throw error;
        }
    }

    static async addTrayecto(newTrayecto, proyectoId) {
        try {
            const trayecto = await database.trayectos.create(newTrayecto);
            const trayecto_proyecto = await database.proyectos_trayectos.create({ id_trayecto: trayecto.id, id_proyecto: proyectoId })
            return await trayecto
        } catch (error) {
            if (error.constraint == "trayectos_codigo_validity_excl") {
                error.message = this.parseErrorTrayectoCodigoValidity(error)
            }
            throw error
        }
    }

    static async addTrayectoFromCSV(trayectoCsv, proyectoId) {
        try {
            let tipoTrayecto = await TipoTrayectoService.getTipoTrayectoByName(trayectoCsv.tipoTrayecto)

            if (tipoTrayecto === undefined) {
                tipoTrayecto = await TipoTrayectoService.getTipoTrayectoByName('default')
            }

            let newTrayecto = {
                codigo: trayectoCsv.codigo,
                trayecto: trayectoCsv.nombre,
                descripcion: trayectoCsv.descripcion,
                curva: {
                    crs: {
                        type: 'name',
                        properties: {
                            name: 'EPSG:4326'
                        }
                    },
                    type: 'LineString',
                    coordinates: JSON.parse(trayectoCsv.coordenadas)
                },
                validity: [
                    {
                        value: trayectoCsv.tInicio !== "" ? (new Date(trayectoCsv.tInicio)) : null,
                        inclusive: (trayectoCsv.tInicio !== "")
                    },
                    {
                        value: trayectoCsv.tFinal !== "" ? (new Date(trayectoCsv.tFinal)) : null,
                        inclusive: (trayectoCsv.tFinal !== "")
                    }
                ],
                id_tipo_trayecto: tipoTrayecto.id
            }

            const trayecto = await database.trayectos.create(newTrayecto)
            const trayecto_proyecto = await database.proyectos_trayectos.create({ id_trayecto: trayecto.id, id_proyecto: proyectoId })
            return trayecto
        } catch (e) {
            throw e
        }
    }


    static async updateTrayecto(id, updateTrayecto) {
        try {
            const trayectoToUpdate = await database.trayectos.findOne({
                where: { id: Number(id) },
            });
            if (!trayectoToUpdate) {
                throw new Error('No trayecto to update found');
            }

            if (updateTrayecto) {
                await database.trayectos.update(updateTrayecto, {
                    where: { id: Number(id) },
                });
                return updateTrayecto;
            }
            return null;
        } catch (error) {
            if (error.constraint == "trayectos_codigo_validity_excl") {
                error.message = this.parseErrorTrayectoCodigoValidity(error)
            }
            throw error;
        }
    }

    static async getTrayecto(id) {
        try {
            const theTrayecto = await database.trayectos.findOne({
                include: [
                    { model: database.tipos_trayectos },
                ],
                where: { id: Number(id) },
            });
            return theTrayecto
        } catch (error) {
            throw error
        }
    }

    static async getTrayectoByCodigo(theCode) {
        try {
            const theTrayecto = await database.trayectos.findOne({
                where: { codigo: theCode },
            })
            return theTrayecto
        } catch (error) {
            throw error
        }
    }

    static async deleteTrayecto(id) {
        try {
            const trayectoToDelete = await database.trayectos.findOne({
                where: { id: Number(id) }
            })

            if (trayectoToDelete) {
                return await database.trayectos.destroy({
                    where: { id: Number(id) }
                })
            }
            return null
        } catch (error) {
            throw error
        }
    }

    static parseErrorTrayectoCodigoValidity(error) {
        var string = new Array()
        var cadena = error.original.detail.split("(codigo, validity)=").pop().split(",").slice(1, 3)
        if (cadena[0] == ' (') {
            string[0] = '-Infinite'
        } else {
            string[0] = cadena[0].replace(' ', '').replace("+00", "").replace('[', '').replace('"', '').replace('"', '');
        }
        if (cadena[1] == ')).') {
            string[1] = 'Infinite'
        } else {
            string[1] = cadena[1].replace("+00", "").replace(']', '').replace('"', '').replace('"', '').replace(').', '');
        }
        return "Ya existe un Trayecto con el codigo ingresado que es valido en el rango de fechas indicado: " + string.join(" / ")
    }

    static async addCopyTrayecto(newTrayecto, proyectoId) {
        try {

            const trayectoToCopy = {
                id: null,
                trayecto: newTrayecto.trayecto,
                codigo: newTrayecto.codigo,
                descripcion: newTrayecto.descripcion,
                curva: newTrayecto.curva,
                validity: newTrayecto.validity,
                id_tipo_trayecto: newTrayecto.id_tipo_trayecto,
            }

            const trayecto = await database.trayectos.create(trayectoToCopy);
            const trayecto_proyecto = await database.proyectos_trayectos.create({
                id_trayecto: trayecto.id,
                id_proyecto: proyectoId
            })
            return trayecto;
        } catch (error) {
            if (error.constraint === "trayectos_codigo_validity_excl") {
                error.message = this.parseErrorTrayectoCodigoValidityCodigoValidity(error)
            }

            throw error;
        }
    }

    static async deleteTrayectoFromProyectoSoft(aTrayecto) {
        try {
            const trayectoToDelete = await database.trayectos.findOne({
                where: { id: Number(aTrayecto) },
            });

            if (!trayectoToDelete) {
                throw new Error('No se encontró el Trayecto.');
            }

            trayectoToDelete.dataValues.isvalid = false;

            await database.trayectos.update(trayectoToDelete.dataValues, {
                where: { id: Number(aTrayecto) },
            });
            return trayectoToDelete

        } catch (error) {
            throw error;
        }
    }

}
export default TrayectoService
