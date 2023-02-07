module.exports = (sequelize, DataTypes) =>{
    const Trayecto = sequelize.define('trayectos', {
        codigo: {
            type: DataTypes.STRING(40),
            allowNull: true
        },
        trayecto: {
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
        curva: {
            type: DataTypes.GEOMETRY('LINESTRING', 4326),
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
    Trayecto.associate = function(models) {
        Trayecto.belongsTo(models.tipos_trayectos, {foreignKey: 'id_tipo_trayecto'});
        Trayecto.belongsToMany(models.proyectos, {through: 'proyectos_trayectos', foreignKey: 'id_trayecto'});
    };

    return Trayecto;
}