import database from '../src/models';
import Sequelize from "sequelize";
import TipoLugarService from "./TipoLugarService";
const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({ provider: 'openstreetmap' });

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

    return {
        totalItems, results, last, currentPage
    };
};

class LugarService {
    static async getAllLugares() {
        try {
            return await database.lugares.findAll({
                include: [
                    { model: database.tipos_lugares },
                ]
            });
        } catch (error) {
            throw error;
        }
    }

    static async getLugares(withDir, id, isValid) {
        try {
            const isValidCond = (isValid !== 'null') ? { isvalid: isValid } : null;
            if (withDir) {
                return await database.lugares.findAll({
                    include: [
                        {
                            model: database.proyectos,
                            as: 'proyectos',
                            attributes: ['id', 'proyecto'],
                            where: { id: Number(id) },
                        },
                        { model: database.tipos_lugares },
                    ],
                    where: {
                        [Op.and]:[{localizacion: { [Op.not]: null }},isValidCond], 
                    }
                })
            } else {
                return await database.lugares.findAll({
                    include: [
                        {
                            model: database.proyectos,
                            as: 'proyectos',
                            attributes: ['id', 'proyecto'],
                            where: { id: Number(id) },
                        },
                        { model: database.tipos_lugares },
                    ],
                    where: {
                        [Op.and]:[{localizacion: { [Op.is]: null }}, isValidCond], 
                    }
                })
            }
        } catch (e) {
            throw e;
        }
    }

    static async getLugaresByDate(fecha) {
        try {
            return await database.lugares.findAll({
                where: Sequelize.literal(`CAST('${fecha}' AS timestamptz) <@ validity`)
            });
        } catch (error) {
            throw error;
        }
    }

    static async getPertenece() {
        try {
            return await database.sequelize.query('select pertenece, id\n' +
                'from (SELECT m.id, \n' +
                '\tST_Contains(p.poligono,m.punto) pertenece\n' +
                ' FROM public.Lugars p, public.lugares m) as per\n' +
                '\n' +
                'where pertenece is true', { type: database.Sequelize.QueryTypes.SELECT })
        } catch (e) {
            throw e;
        }
    }

    static async GetLugaresByPage(page, size, lugar, fecha) {
        try {
            const conditionNombre = lugar ? { lugar: { [Op.iLike]: `%${lugar}%` } } : null;
            const conditionFecha = fecha ? Sequelize.literal(`CAST('${fecha}' AS timestamptz) <@ validity`) : null;
            const { limit, offset } = getPagination(page, size);
            return await database.lugares.findAndCountAll({
                where: { [Op.and]: [conditionNombre, conditionFecha] },
                order: [
                    ['codigo', 'ASC'],
                    ['id', 'DESC'],
                ], limit, offset,
                include: [
                    { model: database.tipos_lugares },
                ],
            }).then((data) => {
                return getPagingData(data, page, limit);
            });
        } catch (error) {
            throw error;
        }
    }

    static async getLugaresByProyectoByPage(page, size, id, lugar, fecha, esquema,isValid) {
        try {
            const conditionNombre = lugar ? { lugar: { [Op.iLike]: `%${lugar}%` } } : null;
            const conditionFecha = fecha ? Sequelize.literal(`CAST('${fecha}' AS timestamptz) <@ validity`) : null;
            const isValidCond = (isValid !== 'null') ? { isvalid: isValid } : null;
            const { limit, offset } = getPagination(page, size);

            if (esquema == 1) {
                return await database.lugares.findAndCountAll({
                    include: [
                        {
                            model: database.proyectos,
                            as: 'proyectos',
                            attributes: ['id', 'proyecto'],
                            where: { id: Number(id) },
                        },
                        { model: database.tipos_lugares }
                    ],
                    where: { [Op.and]: [conditionNombre, conditionFecha, { localizacion: null }, isValidCond] }, order: [
                        ['codigo', 'ASC'],
                        ['validity', 'ASC'],
                    ], limit, offset,
                }).then((data) => {
                    return getPagingData(data, page, limit);
                });
            }
            if (esquema == 2) {
                return await database.lugares.findAndCountAll({
                    include: [
                        {
                            model: database.proyectos,
                            as: 'proyectos',
                            attributes: ['id', 'proyecto'],
                            where: { id: Number(id) },
                        },
                        { model: database.tipos_lugares }
                    ],
                    where: { [Op.and]: [conditionNombre, conditionFecha, { localizacion: { [Op.ne]: null } }, isValidCond] }, order: [
                        ['codigo', 'ASC'],
                        ['validity', 'ASC'],
                    ], limit, offset,
                }).then((data) => {
                    return getPagingData(data, page, limit);
                });
            }
            return await database.lugares.findAndCountAll({
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
                }]
            }).then((data) => {
                return getPagingData(data, page, limit);
            });
        } catch (error) {
            throw error;
        }
    }

    static async addLugar(newLugar, proyectoId) {
        try {

            const lugar = await database.lugares.create(newLugar);
            const lugar_proyecto = await database.proyectos_lugares.create({
                id_lugar: lugar.id,
                id_proyecto: proyectoId
            })
            return lugar;
        } catch (error) {
            if (error.constraint === "lugares_codigo_validity_excl") {
                error.message = this.parseErrorLugarCodigoValidity(error)
            }

            throw error;
        }
    }

    static async addCopyLugar(newLugar, proyectoId) {
        try {

            const lugarToCopy = {
                id: null,
                lugar: newLugar.lugar,
                codigo: newLugar.codigo,
                descripcion: newLugar.descripcion,
                localizacion: newLugar.localizacion,
                punto: newLugar.punto,
                validity: newLugar.validity,
                id_tipo_lugar: newLugar.id_tipo_lugar,
            }

            const lugar = await database.lugares.create(lugarToCopy);
            const lugar_proyecto = await database.proyectos_lugares.create({
                id_lugar: lugar.id,
                id_proyecto: proyectoId
            })
            return lugar;
        } catch (error) {
            if (error.constraint === "lugares_codigo_validity_excl") {
                error.message = this.parseErrorLugarCodigoValidity(error)
            }

            throw error;
        }
    }

    static async deleteLugarFromProyectoHard(aLugar, proyectoId) {
        try {
            const lugar_proyecto = await database.proyectos_lugares.destroy({
                where: { [Op.and]: [{ id_lugar: Number(aLugar) }, { id_proyecto: proyectoId }] },
            });

            const lugar = await database.lugares.destroy({
                where: { id: Number(aLugar) },
            });
        } catch (error) {
            throw error;
        }
    }

    static async deleteLugarFromProyectoSoft(aLugar) {
        try {
            const lugarToDelete = await database.lugares.findOne({
                where: { id: Number(aLugar) },
            });

            if (!lugarToDelete) {
                throw new Error('No se encontró el Lugar.');
            }

            lugarToDelete.dataValues.isvalid = false;

            await database.lugares.update(lugarToDelete.dataValues, {
                where: { id: Number(aLugar) },
            });
            return lugarToDelete

        } catch (error) {
            throw error;
        }
    }


    static async addLugarFromCsv1(lugarCsv, proyectoId) {
        try {
            let tipoLugar = await TipoLugarService.getTipoLugarByName(lugarCsv.tipoLugar)

            if (tipoLugar === undefined) {
                tipoLugar = await TipoLugarService.getTipoLugarByName('default')
            }

            lugarCsv.tInicio = lugarCsv.tInicio === "''" ? "" : lugarCsv.tInicio

            lugarCsv.tFinal = lugarCsv.tFinal === "''" ? "" : lugarCsv.tFinal

            const lugar = {
                codigo: lugarCsv.codigo,
                lugar: lugarCsv.nombre,
                descripcion: lugarCsv.descripcion,
                punto: {
                    crs: {
                        type: 'name',
                        properties: {
                            name: 'EPSG:4326'
                        }
                    },
                    type: 'Point',
                    coordinates: [
                        lugarCsv.lat,
                        lugarCsv.lon
                    ]
                },
                validity: [
                    {
                        value: lugarCsv.tInicio !== "" ? (new Date(lugarCsv.tInicio)) : null,
                        inclusive: (lugarCsv.tInicio !== "")
                    },
                    {
                        value: lugarCsv.tFinal !== "" ? (new Date(lugarCsv.tFinal)) : null,
                        inclusive: (lugarCsv.tFinal !== "")
                    }
                ],
                id_tipo_lugar: tipoLugar.id,
            }


            const newLugar = await database.lugares.create(lugar)
            const lugar_proyecto = await database.proyectos_lugares.create({
                id_lugar: newLugar.id,
                id_proyecto: proyectoId
            })

            return lugar;
        } catch (error) {
            if (error.constraint === "lugares_codigo_validity_excl") {
                error.message = this.parseErrorLugarCodigoValidity(error)
            }
            throw error;
        }
    }

    static async addLugarFromCsv2(lugarCsv, proyectoId) {
        try {
            let tipoLugar = await TipoLugarService.getTipoLugarByName(lugarCsv.tipoLugar)


            if (tipoLugar === null) {
                tipoLugar = await TipoLugarService.getTipoLugarByName('default')
            }

            const localizacion = lugarCsv.calle + ' ' + lugarCsv.altura + ', ' + lugarCsv.ciudad
            console.log(localizacion)
            const res = await geocoder.geocode(lugarCsv.calle + ' ' + lugarCsv.altura + ' ' + lugarCsv.ciudad);

            console.log(res)
            lugarCsv.tInicio = lugarCsv.tInicio === "''" ? "" : lugarCsv.tInicio

            lugarCsv.tFinal = lugarCsv.tFinal === "''" ? "" : lugarCsv.tFinal

            const lugar = {
                codigo: lugarCsv.codigo,
                lugar: lugarCsv.nombre,
                descripcion: lugarCsv.descripcion,
                localizacion: localizacion,
                punto: {
                    crs: {
                        type: 'name',
                        properties: {
                            name: 'EPSG:4326'
                        }
                    },
                    type: 'Point',
                    coordinates: [
                        res[0].latitude,
                        res[0].longitude
                    ]
                },
                validity: [
                    {
                        value: lugarCsv.tInicio !== "" ? (new Date(lugarCsv.tInicio)) : null,
                        inclusive: (lugarCsv.tInicio !== "")
                    },
                    {
                        value: lugarCsv.tFinal !== "" ? (new Date(lugarCsv.tFinal)) : null,
                        inclusive: (lugarCsv.tFinal !== "")
                    }
                ],
                id_tipo_lugar: tipoLugar.id,
            }
            const newLugar = await database.lugares.create(lugar)
            const lugar_proyecto = await database.proyectos_lugares.create({
                id_lugar: newLugar.id,
                id_proyecto: proyectoId
            })

            return lugar;
        } catch (error) {
            if (error.constraint === "lugares_codigo_validity_excl") {
                error.message = this.parseErrorLugarCodigoValidity(error)
            }
            throw error;
        }
    }

    static async updateLugar(id, updateLugar) {
        try {
            const LugarToUpdate = await database.lugares.findOne({
                where: { id: Number(id) },
            });
            if (!LugarToUpdate) {
                throw new Error('No Lugar to update found');
            }

            if (updateLugar) {
                await database.lugares.update(updateLugar, {
                    where: { id: Number(id) },
                });
                return updateLugar;
            }
            return null;
        } catch (error) {
            if (error.constraint == "lugares_codigo_validity_excl") {
                error.message = this.parseErrorLugarCodigoValidity(error)
            }
            console.log('error!!!!!!!!!!')
            throw error;
        }
    }

    static async getLugarByCode(codigo) {
        try {
            return await database.lugares.findOne({
                where: { codigo: String(codigo) }
            });
        } catch (error) {
            throw error;
        }
    }

    static async getLugar(id) {
        try {
            return await database.lugares.findOne({
                include: [
                    { model: database.tipos_lugares },
                ],
                where: { id: Number(id) }
            });
        } catch (error) {
            throw error;
        }
    }

    static async deleteLugar(id) {
        try {
            const LugarToDelete = await database.lugares.findOne({
                where: { id: Number(id) },
            });

            if (LugarToDelete) {
                return await database.lugares.destroy({
                    where: { id: Number(id) },
                });
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    static parseErrorLugarCodigoValidity(error) {
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
        return "Ya existe un Lugar con el codigo ingresado que es valido en el rango de fechas indicado: " + string.join(" / ")
    }
}

export default LugarService;
