"use strict";

module.exports = (sequelize, DataTypes) => {
    const oferta = sequelize.define('oferta', {
        hora_visita: { type: DataTypes.DATE, allowNull: false },
        fecha_visita: { type: DataTypes.DATE, allowNull: false },
        precondiciones: { type: DataTypes.STRING(500), allowNull: true },
        estado: {
            type: DataTypes.ENUM("Finalizado", "Postulado", "Contratado"),
            allowNull: false,
            defaultValue: "Postulado", 
        },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    }, { freezeTableName: true, timestamps: true });

    oferta.associate = function(models) {
        // Relación: una oferta pertenece a un trabajo
        oferta.belongsTo(models.trabajo, {
            foreignKey: 'id_trabajo', 
            as: 'trabajo',
        });

        // Relación: una persona de tipo trabajador hace la oferta
        oferta.belongsTo(models.persona, {
            foreignKey: 'id_persona', 
            as: 'trabajador',
        });
    };

    return oferta;
};