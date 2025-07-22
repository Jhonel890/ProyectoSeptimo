"use strict";

module.exports = (sequelize, DataTypes) => {
    const oficio = sequelize.define('oficio', {
        nombre: { type: DataTypes.STRING(100), allowNull: false },
        descripcion: { type: DataTypes.STRING(500), allowNull: true },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { freezeTableName: true, timestamps: true });

    oficio.associate = function(models) {
        // Relación: una persona tiene muchos oficios
        oficio.belongsToMany(models.persona, {
            through: 'persona_oficio', 
            foreignKey: 'id_oficio', 
            otherKey: 'id_persona', 
            as: 'personas',
        });

        // Relación: un oficio es usado por muchos trabajos
        oficio.hasMany(models.trabajo, {
            foreignKey: 'id_oficio', 
            as: 'trabajos',
        });
    };

    return oficio;  
};