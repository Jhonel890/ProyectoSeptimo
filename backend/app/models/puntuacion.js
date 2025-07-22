"use strict";

module.exports = (sequelize, DataTypes) => {
    const puntuacion = sequelize.define('puntuacion', {
        valor: { type: DataTypes.INTEGER, allowNull: false },
        comentario: { type: DataTypes.STRING(500), allowNull: true },
        fecha_evaluacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        estado: { type: DataTypes.BOOLEAN, defaultValue: true },
        persona_evaluador: { type: DataTypes.UUID, allowNull: false },
        persona_evaluada: { type: DataTypes.UUID, allowNull: false },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { freezeTableName: true, timestamps: true });

    puntuacion.associate = function(models) {
        // Relación de muchos a uno con persona (persona evaluada)
        puntuacion.belongsTo(models.persona, {
            foreignKey: 'id_persona', 
            as: 'persona',
        });
    };

    return puntuacion;
};