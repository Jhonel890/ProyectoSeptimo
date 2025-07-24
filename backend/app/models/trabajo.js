"use strict";

module.exports = (sequelize, DataTypes) => {
    const trabajo = sequelize.define('trabajo', {
        titulo_trabajo: { type: DataTypes.STRING(100), allowNull: false },
        descripcion: { type: DataTypes.STRING(500), allowNull: true },
        estado: {
            type: DataTypes.ENUM("Finalizado", "Postulado", "Contratado"),
            allowNull: false,
            defaultValue: "Postulado", 
        },
        fecha_inicio: { type: DataTypes.DATE, allowNull: false },
        fecha_fin: { type: DataTypes.DATE, allowNull: true },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { freezeTableName: true, timestamps: true });

    trabajo.associate = function (models) {
        // Relación de muchos a muchos con oficio
        trabajo.belongsToMany(models.oficio, {
            through: 'trabajo_oficio', // Nombre de la tabla intermedia
            foreignKey: 'id_trabajo',
            otherKey: 'id_oficio',
            as: 'oficios', // Alias para la relación
        });
    
        // Relación de muchos a uno con persona
        trabajo.belongsTo(models.persona, {
            foreignKey: 'id_persona',
            as: 'persona',
        });
    
        // Relación de 1 a 1 con contrato
        trabajo.hasOne(models.contrato, {
            foreignKey: 'id_trabajo',
            as: 'contrato',
        });
    
        // Relación de 1 a 1 con oferta
        trabajo.hasOne(models.oferta, {
            foreignKey: 'id_trabajo',
            as: 'oferta',
        });
    
    };

    return trabajo;
};