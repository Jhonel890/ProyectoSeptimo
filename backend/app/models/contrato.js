"use strict";

const { exportTraceState } = require("next/dist/trace");

module.exports = (sequelize, DataTypes) => {
    const contrato = sequelize.define('contrato', {
        horas_trabajo: { type: DataTypes.INTEGER, allowNull: false },
        trabajador: { type: DataTypes.STRING(100), allowNull: false },
        external_contratista: { type: DataTypes.UUID, allowNull: false },
        estado: {
            type: DataTypes.ENUM("Finalizado", "Postulado", "Contratado"),
            allowNull: false,
            defaultValue: "Postulado", 
          },        
        estado :   { type: DataTypes.BOOLEAN, defaultValue: true },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    }, { freezeTableName: true, timestamps: true });


    
    contrato.associate = function (models) {
        // Relación 1 a 1 con pago
        contrato.hasOne(models.pago, {
          foreignKey: "contratoId", 
          as: "pago",
        });
      };
    
    return contrato;
};