module.exports = (sequelize, DataTypes) =>{
    const TipoZona = sequelize.define('tipos_zonas', {
        tipo_zona: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        tipo_linea: {
            type: DataTypes.STRING(60),
            allowNull: true
        },
        color: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        color_relleno: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        descripcion: {
            type: DataTypes.STRING(400),
            allowNull: true
        },
    },{
        timestamps: false
    });
    TipoZona.associate = function(model) {
        TipoZona.hasMany(model.zonas, {foreignKey: 'id_tipo_zona'})
    };
    return TipoZona;
}
