'use strict';

const models = require('../models');
const Rol = models.rol;
const uuid = require('uuid');
const {rolSchema} = require('../schemas/schemas');

class RolControl {
    async listar(req, res) {
        try {
            const lista = await Rol.findAll({
                attributes: ['nombre', 'external_id']
            });
            res.status(200).json({ message: "EXITO", code: 200, data: lista });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async obtener(req, res) {
        try {
            const result = await Rol.findOne({
                where: {
                    external_id: req.params.external
                },
                attributes: ['nombre', 'external_id']
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
        try {
            const safeBody = rolSchema.safeParse(req.body);
            if (safeBody.error) {
                res.status(400).json({ message: safeBody.error, tag: "Datos incorrectos", code: 400 });
            } else {
                const data = safeBody.data;
                const result = await Rol.create(data);
                if (!result) {
                    res.status(401).json({ message: "ERROR", tag: "No se puede crear", code: 401 });
                } else {
                    res.status(200).json({ message: "EXITO", code: 200 });
                }
            }

        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async modificar(req, res) {
        try {
            const safeBody = rolSchema.safeParse(req.body);
            if (safeBody.error) {
                res.status(400).json({ message: safeBody.error, tag: "Datos incorrectos", code: 400 });
            } else {
                const data = safeBody.data;
                const result = await Rol.update(data, {
                    where: {
                        external_id: req.params.external
                    }
                });
                if (!result) {
                    res.status(401).json({ message: "ERROR", tag: "No se puede modificar", code: 401 });
                } else {
                    res.status(200).json({ message: "EXITO", code: 200 });
                }
            }
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }
}

module.exports = RolControl;
