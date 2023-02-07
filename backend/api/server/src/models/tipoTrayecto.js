module.exports = (sequelize, DataTypes) =>{
    const TipoTrayecto = sequelize.define('tipos_trayectos', {
        tipo_trayecto: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        clasificador: {
            type: DataTypes.STRING(60),
            allowNull: true
        },
        linea: {
            type: DataTypes.INTEGER(),
            allowNull: true
        },
        tipo_linea: {
            type: DataTypes.STRING(60),
            allowNull: true
        },
        color: {
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
    TipoTrayecto.associate = function(model) {
        TipoTrayecto.hasMany(model.trayectos, {foreignKey: 'id_tipo_trayecto'})
    };
    return TipoTrayecto;
}
