module.exports = (sequelize, DataTypes) =>{
    const TipoLugar = sequelize.define('tipos_lugares', {
        tipo_lugar: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        clasificador: {
            type: DataTypes.STRING(60),
            allowNull: true
        },
        tipo_marcador: {
            type: DataTypes.ENUM('tipo_marcador'),
            allosNull: true
        },
        icono: {
            type: DataTypes.STRING(60),
            allowNull: true
        },
        size: {
            type: DataTypes.INTEGER(),
            allowNull: true
        },
        color: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        descripcion: {
            type: DataTypes.STRING(),
            allowNull: true
        }
    },{
        timestamps: false
    });
    TipoLugar.associate = function(models) {
        TipoLugar.hasMany(models.lugares, {foreignKey: 'id_tipo_lugar'})
    };
    return TipoLugar;
};