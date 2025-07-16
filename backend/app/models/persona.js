"use strict";

module.exports = (sequelize, DataTypes) => {
  const persona = sequelize.define(
    "persona",
    {
      nombres: { type: DataTypes.STRING(150), allowNull: false },
      apellidos: { type: DataTypes.STRING(150), allowNull: false },
      direccion: { type: DataTypes.STRING(300), allowNull: true },
      cedula: { type: DataTypes.STRING(15), allowNull: false },
      monedas: { type: DataTypes.DOUBLE, defaultValue: 0 },
      descripcion: { type: DataTypes.STRING(500), allowNull: true },
      external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  persona.associate = function (models) {
    persona.hasOne(models.cuenta, {
      foreignKey: "id_persona",
      as: "cuenta",
    });
    persona.belongsTo(models.rol, {
      foreignKey: "id_rol",
    });

    persona.hasMany(models.inquietud, {
      foreignKey: "id_persona",
      as: "inquietudes",
    });

    persona.hasMany(models.respuesta, {
      foreignKey: "id_persona",
      as: "respuestas",
    });

    persona.belongsToMany(models.perfil, {
      through: "persona_perfil",
      foreignKey: "id_persona",
      as: "perfiles",
    });
  };

  return persona;
};
