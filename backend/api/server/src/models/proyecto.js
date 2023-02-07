module.exports = (sequelize, DataTypes) => {
    const Proyecto = sequelize.define('proyectos', {
        proyecto: {
            type: DataTypes.STRING(60),
            allowNull: true
        },
        descripcion: {
            type: DataTypes.STRING(),
            allowNull: true
        },
        observaciones: {
            type: DataTypes.STRING(),
            allowNull: true
        },
        timegen: {
            type: DataTypes.DATE(),
            allowNull: true
        },
        visibilidad: {
            type: DataTypes.STRING(),
            allowNull: true
        },
        isvalid: {
            type: DataTypes.BOOLEAN(),
            allowNull: true
        }
    }, {
        timestamps: false
    });
    Proyecto.associate = function (models) {
        Proyecto.belongsTo(models.usuarios, {foreignKey: 'id_usuario'})
        Proyecto.belongsToMany(models.lugares, {through: 'proyectos_lugares', foreignKey: 'id_proyecto'})
        Proyecto.belongsToMany(models.zonas, {through: 'proyectos_zonas', foreignKey: 'id_proyecto'})
        Proyecto.belongsToMany(models.trayectos, {through: 'proyectos_trayectos', foreignKey: 'id_proyecto'})
    };
    return Proyecto;
};
