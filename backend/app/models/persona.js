"use strict";

module.exports = (sequelize, DataTypes) => {
  const persona = sequelize.define(
    "persona",
    {
      nombres: { type: DataTypes.STRING(150), allowNull: false },
      apellidos: { type: DataTypes.STRING(150), allowNull: false },
      direccion: { type: DataTypes.STRING(300), allowNull: true },
      cedula: { type: DataTypes.STRING(15), allowNull: false },
      estado: {
        type: DataTypes.ENUM("Activo", "Inactivo"),
        allowNull: false,
        defaultValue: "Activo", 
      },
      rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "rol",
          key: "id",
        },
      },
      num_telefono: { type: DataTypes.STRING(15), allowNull: true },
      external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  persona.associate = function (models) {
    // Relación 1 a 1 con rol
    persona.belongsTo(models.rol, {
      foreignKey: "rol_id",
      as: "rol",
    });
    

    // Relación 1 a 1 con cuenta
    persona.hasOne(models.cuenta, {
      foreignKey: "id_persona", 
      as: "cuenta",
    });

    // Relación 1 a muchos con puntaje
    persona.hasMany(models.puntuacion, {
      foreignKey: "id_persona", 
      as: "puntajes",
    });

    // Relación 1 a muchos con oficio (a través de una tabla intermedia)
    persona.belongsToMany(models.oficio, {
      through: "persona_oficio", 
      foreignKey: "id_persona", 
      otherKey: "id_oficio", 
      as: "oficios",
    });

    // Relación 1 a muchos con trabajo
    persona.hasMany(models.trabajo, {
      foreignKey: "id_persona", 
      as: "trabajos",
    });

    // Relación 1 a muchos con oferta
    persona.hasMany(models.oferta, {
      foreignKey: "id_persona", 
      as: "ofertas",
    });

    // Relación 1 a 1 con contrato
    persona.hasOne(models.contrato, {
      foreignKey: "id_persona", 
      as: "contrato",
    });
  };

  return persona;
};