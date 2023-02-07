module.exports = (sequelize, DataTypes) => {
    const ZonaProyecto = sequelize.define('proyectos_zonas', {
      id_zona: DataTypes.INTEGER,
      id_proyecto: DataTypes.INTEGER
    },{
      timestamps: false
    });
    ZonaProyecto.associate = function(models) {
      ZonaProyecto.belongsTo(models.zonas, {foreignKey: 'id_zona'})
      ZonaProyecto.belongsTo(models.proyectos, {foreignKey: 'id_proyecto'})
    };
    return ZonaProyecto;
  };