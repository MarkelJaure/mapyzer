module.exports = (sequelize, DataTypes) =>{
    const Usuario = sequelize.define('usuarios', {
        username: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(),
            allowNull: false
        },
        rol: {
            type: DataTypes.ENUM('administrador', 'usuario', 'invitado'),
            allowNull: false
        },
        token: {
            type: DataTypes.STRING(),
            allowNull: true
        },
    },{
        timestamps: false
    });
    Usuario.associate = function(models) {
        Usuario.hasMany(models.proyectos, {foreignKey: 'id_usuario'});
        Usuario.belongsTo(models.personas, {foreignKey: 'id_persona'})
    };
    return Usuario;
}
