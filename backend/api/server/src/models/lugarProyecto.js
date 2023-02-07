module.exports = (sequelize, DataTypes) => {
    const LugarProyecto = sequelize.define('proyectos_lugares', {
      id_lugar: DataTypes.INTEGER,
      id_proyecto: DataTypes.INTEGER,
    },{
      timestamps: false
    });
    LugarProyecto.associate = function(models) {
      LugarProyecto.belongsTo(models.lugares, {foreignKey: 'id_lugar'})
      LugarProyecto.belongsTo(models.proyectos, {foreignKey: 'id_proyecto'})
    };
    return LugarProyecto;
  };