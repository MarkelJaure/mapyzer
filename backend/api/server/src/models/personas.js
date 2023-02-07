module.exports = (sequelize, DataTypes) =>{
    const Persona = sequelize.define('personas', {
        name: {
            type: DataTypes.STRING(),
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING(),
            allowNull: false
        },
        dni: {
            type: DataTypes.BIGINT(),
            allowNull: false
        },
        telefono: {
            type: DataTypes.BIGINT(),
            allowNull: false
        },
        estudios: {
            type: DataTypes.ENUM('educacion inicial no finalizada', 'educacion inicial finalizada', 'educacion primaria no finalizada', 'educacion primaria finalizada','educacion secundaria no finalizada','educacion secundaria finalizada','educacion superior no finalizada','educacion superior finalizada'),
            allowNull: false
        },
        ambito: {
            type: DataTypes.ENUM('salud', 'educacion', 'seguridad','transporte','finanzas','comercio','industria',' comunicación'),
            allowNull: false
        },
    },{
        timestamps: false
    });
    Persona.associate = function(models) {
        Persona.belongsTo(models.usuarios, {foreignKey: 'id'});
    };
    return Persona;
}
