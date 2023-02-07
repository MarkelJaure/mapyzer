module.exports = (sequelize, DataTypes) =>{
    const Zona = sequelize.define('zonas', {
        codigo: {
            type: DataTypes.STRING(40),
            allowNull: true
        },
        zona: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(),
            allowNull: true
        },
        observaciones: {
            type: DataTypes.STRING(),
            allowNull: true
        },
        poligono: {
            type: DataTypes.GEOMETRY('POLYGON', 4326),
            allowNull: true
        },
        zona_super: {
            type: DataTypes.INTEGER(),
            allowNull: true
        },
        punto_ref: {
            type: DataTypes.GEOMETRY('POINT', 4326),
            allowNull: true
        },
        validity: {
            type: DataTypes.RANGE(DataTypes.DATE),
            allowNull: true
        },
        isvalid: {
            type: DataTypes.BOOLEAN(),
            allowNull: true
        }
    },{
        timestamps: false
    });
    Zona.associate = function(models) {
        Zona.belongsTo(models.tipos_zonas, {foreignKey: 'id_tipo_zona'});
        Zona.belongsToMany(models.proyectos, {through: 'proyectos_zonas', foreignKey: 'id_zona'});
    };

    return Zona;
}
