"use strict";

module.exports = (sequelize, DataTypes) => {
  const Respuesta = sequelize.define(
    "respuesta",
    {
      descripcion: { type: DataTypes.STRING(500), allowNull: false },
      imagen: { type: DataTypes.STRING(500), allowNull: true },
      video: { type: DataTypes.STRING(500), allowNull: true },
      external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
      estado: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  Respuesta.associate = function (models) {
    Respuesta.belongsTo(models.inquietud, {
      foreignKey: 'id_inquietud',
      as: 'inquietud',
    });
  
    Respuesta.belongsTo(models.persona, {
      foreignKey: 'id_persona',
      as: 'persona',
    });
  };

  return Respuesta;
};
