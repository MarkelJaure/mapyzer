module.exports = (sequelize, DataTypes) =>{
    return sequelize.define('direcciones', { //nombre de la tabla
        codigo: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(),
            allowNull: true
        },
        ciudad: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        altura: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        calle: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        tipoLugar: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        tInicio: {
            type: DataTypes.STRING(120),
            allowNull: true
        },
        tFinal: {
            type: DataTypes.STRING(120),
            allowNull: true
        },
        procesado: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        proyecto_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });
}
