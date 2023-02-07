module.exports = (sequelize, DataTypes) =>{
    const Lugar = sequelize.define('lugares', { //nombre de la tabla
        codigo: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        lugar: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        localizacion: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        descripcion: {
            type: DataTypes.STRING(),
            allowNull: true
        },
        punto: {
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
    Lugar.associate = function(models) {
        Lugar.belongsTo(models.tipos_lugares, {foreignKey: 'id_tipo_lugar'})
        Lugar.belongsToMany(models.proyectos, {through: 'proyectos_lugares', foreignKey: 'id_lugar'})
    };
    return Lugar;
}
