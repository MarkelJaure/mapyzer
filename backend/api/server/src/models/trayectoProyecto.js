module.exports = (sequelize, DataTypes) => {
    const TrayectoProyecto = sequelize.define('proyectos_trayectos', {
      id_trayecto: DataTypes.INTEGER,
      id_proyecto: DataTypes.INTEGER
    },{
      timestamps: false
    });
    TrayectoProyecto.associate = function(models) {
      TrayectoProyecto.belongsTo(models.trayectos, {foreignKey: 'id_trayecto'})
      TrayectoProyecto.belongsTo(models.proyectos, {foreignKey: 'id_proyecto'})
    };
    return TrayectoProyecto;
  };