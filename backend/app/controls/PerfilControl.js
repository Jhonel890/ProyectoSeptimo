'use strict';

const { persona, perfil } = require('../models');
const {perfilSchema} = require('../schemas/schemas');
const uuid = require('uuid');

class PerfilControl {
    async listar(req, res) {
        try {
            const lista = await perfil.findAll({
                attributes: ['nombre', 'external_id']});
            res.status(200).json({ message: "Éxito", code: 200, data: lista });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async obtener(req, res) {
        try {
            const result = await perfil.findOne({
                where: {
                    external_id: req.params.external
                },
                attributes: ['nombre', 'external_id'],
                include: {model: persona, as: 'personas', attributes: ['nombres', 'apellidos', 'external_id']}
            });
            if (!result) {
                res.status(404).json({ message: "ERROR", tag: "No encontrado", code: 404 });
            } else {
                res.status(200).json({ message: "EXITO", code: 200, data: result });
            }
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async guardar(req, res) {
        const safeBody = perfilSchema.safeParse(req.body);

        if (safeBody.error) {
            res.status(400);
            return res.json({ message: safeBody.error, tag: "Datos incorrectos", code: 400 });
            
        } else {
            const data = { ...safeBody.data };

            data.external_id = uuid.v4();

            await perfil.create(data);
            res.status(201).json({ message: "EXITO", code: 201 });
        }
    }

    async modificar(req, res) {
        const safeBody = perfilSchema.safeParse(req.body);

        if (safeBody.error) {
            res.status(400);
            return res.json({ message: safeBody.error, tag: "Datos incorrectos", code: 400 });
            
        } else {
            const data = { ...safeBody.data };

            await perfil.update(data, {
                where: {
                    external_id: req.params.external
                }
            });
            res.status(200).json({ message: "EXITO", code: 200 });
        }
    }

}

module.exports = PerfilControl;