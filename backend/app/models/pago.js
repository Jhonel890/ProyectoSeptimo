"use strict";

module.exports = (sequelize, DataTypes) => {
    const pago = sequelize.define('pago', {
        valor: { type: DataTypes.INTEGER, allowNull: false },
        fecha_pago: { type: DataTypes.DATE, allowNull: false },
        estado: { type: DataTypes.BOOLEAN, defaultValue: true },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { freezeTableName: true, timestamps: true });

    pago.associate = function (models) {
        // Relación 1 a 1 con contrato
        pago.belongsTo(models.contrato, {
            foreignKey: "contratoId", 
            as: "contrato",
        });
    };

    return pago;
};