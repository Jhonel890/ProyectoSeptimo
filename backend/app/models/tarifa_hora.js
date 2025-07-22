"use strict";

module.exports = (sequelize, DataTypes) => {
    const tarifa_hora = sequelize.define('tarifa_hora', {
        valor: { type: DataTypes.INTEGER, allowNull: false },
    }, { freezeTableName: true, timestamps: true });

    tarifa_hora.associate = function(models) {
        tarifa_hora.belongsTo(models.persona, {
            foreignKey: 'id_persona', 
            as: 'persona',
        });
    }
    return tarifa_hora;
}