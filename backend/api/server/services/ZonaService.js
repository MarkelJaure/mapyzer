import database from '../src/models'

const { QueryTypes } = require('sequelize');
import zona from "../src/models/zona"
import Sequelize from "sequelize";
import TipoZonaService from "./TipoZonaService";
import TipoLugarService from "./TipoLugarService";

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

class ZonaService {
    static async getAllZonas() {
        try {
            return await database.zonas.findAll({
                include: [
                    { model: database.tipos_zonas },
                ],
            })
        } catch (error) {
            throw error
        }
    }

    static async getByProyecto(proyectoId, isValid) {
        try {
            const isValidCond = (isValid !== 'null') ? { isvalid: isValid } : null;
            return await database.zonas.findAll({
                where: isValidCond,
                include: [
                    {
                        model: database.proyectos,
                        as: 'proyectos',
                        attributes: ['id', 'proyecto'],
                        where: { id: Number(proyectoId) },
                    },
                    { model: database.tipos_zonas }
                ]
            })
        } catch (e) {
            throw e
        }
    }

    static async GetZonasByPage(page, size, zona, fecha) {
        try {
            const conditionNombre = zona ? { zona: { [Op.iLike]: `%${zona}%` } } : null;
            const conditionFecha = fecha ? Sequelize.literal(`CAST('${fecha}' AS timestamptz) <@ validity`) : null;
            const { limit, offset } = getPagination(page, size);
            return await database.zonas.findAndCountAll({
                where: { [Op.and]: [conditionNombre, conditionFecha] }, order: [
                    ['codigo', 'ASC'],
                    ['validity', 'ASC'],
                ], limit, offset,
                include: [
                    { model: database.tipos_zonas, attributes: ['id', 'tipo_zona'] },
                ],
            }).then(data => {
                return getPagingData(data, page, limit)
            })
        } catch (error) {
            throw error
        }
    }

    static async getZonasByProyectoByPage(page, size, id, zona, fecha, isValid) {
        try {
            const isValidCond = (isValid !== 'null') ? { isvalid: isValid } : null;
            const conditionNombre = zona ? { zona: { [Op.iLike]: `%${zona}%` } } : null;
            const conditionFecha = fecha ? Sequelize.literal(`CAST('${fecha}' AS timestamptz) <@ validity`) : null;
            const { limit, offset } = getPagination(page, size);

           return await database.zonas.findAndCountAll({
                where: { [Op.and]: [conditionNombre, conditionFecha, isValidCond] },
                order: [
                    ['codigo', 'ASC'],
                    ['validity', 'ASC'],
                ],
                limit,
                offset,
                include: [{
                    model: database.proyectos,
                    as: 'proyectos',
                    attributes: ['id', 'proyecto'],
                    where: { id: Number(id) },
                }, { model: database.tipos_zonas },]
            }).then((data) => {
                return getPagingData(data, page, limit);
            });
        } catch (error) {
            throw error;
        }
    }

    static async addZona(newZona, proyectoId) {
        try {
            const zona = await database.zonas.create(newZona);
            const zona_proyecto = await database.proyectos_zonas.create({ id_zona: zona.id, id_proyecto: proyectoId })
            return await zona
        } catch (error) {
            if (error.constraint == "zonas_codigo_validity_excl") {
                error.message = this.parseErrorZonaCodigoValidity(error)
            }
            throw error
        }
    }

    static async addZonaFromCsv(zonaCsv, proyectoId) {
        try {
            let tipoZona = await TipoZonaService.getTipoZonaByName(zonaCsv.tipoZona)

            if (tipoZona === undefined) {
                tipoZona = await TipoZonaService.getTipoZonaByName('default')
            }

            let newZona = {
                codigo: zonaCsv.codigo,
                zona: zonaCsv.nombre,
                id_tipo_zona: tipoZona.id,
                poligono: {
                    crs: {
                        type: 'name',
                        properties: {
                            name: 'EPSG:4326'
                        }
                    },
                    type: 'Polygon',
                    coordinates: JSON.parse("[" + zonaCsv.coordenadas + "]")
                },
                validity: [
                    {
                        value: zonaCsv.tInicio !== "" ? (new Date(zonaCsv.tInicio)) : null,
                        inclusive: (zonaCsv.tInicio !== "")
                    },
                    {
                        value: zonaCsv.tFinal !== "" ? (new Date(zonaCsv.tFinal)) : null,
                        inclusive: (zonaCsv.tFinal !== "")
                    }
                ],
            }

            const zona = await database.zonas.create(newZona);
            const zona_proyecto = await database.proyectos_zonas.create({ id_zona: zona.id, id_proyecto: proyectoId })
            return zona
        } catch (error) {
            if (error.constraint == "zonas_codigo_validity_excl") {
                error.message = this.parseErrorZonaCodigoValidity(error)
            }
            throw error
        }
    }


    static async updateZona(id, updateZona) {
        try {
            const ZonaToUpdate = await database.zonas.findOne({
                where: { id: Number(id) },
            });
            if (!ZonaToUpdate) {
                throw new Error('No Zona to update found');
            }

            if (updateZona) {
                await database.zonas.update(updateZona, {
                    where: { id: Number(id) },
                });
                return updateZona;
            }
            return null;
        } catch (error) {
            if (error.constraint == "zonas_codigo_validity_excl") {
                error.message = this.parseErrorZonaCodigoValidity(error)
            }
            throw error;
        }
    }


    static async getZona(id) {
        try {
            const theZona = await database.zonas.findOne({
                include: [
                    { model: database.tipos_zonas },
                ],
                where: { id: Number(id) },
            });
            return theZona
        } catch (error) {
            throw error
        }
    }

    static async getZonaByCodigo(theCode) {
        try {
            const theZona = await database.zonas.findOne({
                where: { codigo: String(theCode) },
            })
            return theZona
        } catch (error) {
            throw error
        }
    }

    static async deleteZona(id) {
        try {
            const ZonaToDelete = await database.zonas.findOne({
                where: { id: Number(id) }
            })

            if (ZonaToDelete) {
                return await database.zonas.destroy({
                    where: { id: Number(id) }
                })
            }
            return null
        } catch (error) {
            throw error
        }
    }

    static async deleteZonaFromProyectoSoft(aZona) {
        try {
            const zonaToDelete = await database.zonas.findOne({
                where: { id: Number(aZona) },
            });

            if (!zonaToDelete) {
                throw new Error('No se encontró la Zona.');
            }

            zonaToDelete.dataValues.isvalid = false;

            await database.zonas.update(zonaToDelete.dataValues, {
                where: { id: Number(aZona) },
            });
            return zonaToDelete

        } catch (error) {
            throw error;
        }
    }


    static parseErrorZonaCodigoValidity(error) {
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
        return "Ya existe una Zona  con el codigo ingresado que es valida en el rango de fechas indicado: " + string.join(" / ")
    }

    static async addCopyZona(newZona, proyectoId) {

        try {

            const zonaToCopy = {
                id: null,
                zona: newZona.zona,
                codigo: newZona.codigo,
                descripcion: newZona.descripcion,
                poligono: newZona.poligono,
                validity: newZona.validity,
                id_tipo_zona: newZona.id_tipo_zona,
            }

            const zona = await database.zonas.create(zonaToCopy);
            const zona_proyecto = await database.proyectos_zonas.create({
                id_zona: zona.id,
                id_proyecto: proyectoId
            })
            return zona;
        } catch (error) {
            if (error.constraint === "zonas_codigo_validity_excl") {
                error.message = this.parseErrorZonaCodigoValidity(error)
            }

            throw error;
        }
    }
}

export default ZonaService
