'use strict';

const { Model, where } = require('sequelize');
const { persona, inquietud, respuesta, sequelize,perfil } = require('../models');
const { inquietudSchema } = require('../schemas/schemas');
const uuid = require('uuid');


class InquietudControl {
    async listar(req, res) {
        try {
            const lista = await inquietud.findAll({
                attributes: ['titulo', 'descripcion', 'imagen', 'video', 'estado', 'external_id'],
                include: { model: respuesta, as: 'respuestas', attributes: ['descripcion', 'external_id'] },
                include: { model: perfil, as: 'perfiles', attributes: ['nombre', 'external_id'] },
            });
            res.status(200).json({ message: "Éxito", code: 200, data: lista });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async obtener(req, res) {
        try {
            const result = await inquietud.findOne({
                where: {
                    external_id: req.params.external
                },
                attributes: ['titulo', 'descripcion', 'imagen', 'video', 'estado', 'external_id'],
                include: { model: respuesta, as: 'respuestas', attributes: ['descripcion', 'external_id'] }
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
        const safeBody = inquietudSchema.safeParse(req.body);

        if (safeBody.error) {
            return res.status(400).json({ message: safeBody.error, tag: "Datos incorrectos", code: 400 });
        }

        const transaction = await sequelize.transaction(); // Inicia la transacción

        try {
            const data = { ...safeBody.data };

            // Buscar a la persona asociada
            const personaA = await persona.findOne({
                where: { external_id: req.body.persona },
            });

            if (!personaA) {
                await transaction.rollback();
                return res.status(404).json({ message: "ERROR", tag: "Persona no encontrada", code: 404 });
            }

            // Asociar la persona
            data.id_persona = personaA.id;

            // Crear la inquietud dentro de la transacción
            const result = await inquietud.create(data, { transaction });

            // Manejar la asociación de perfiles
            if (req.body.perfiles && Array.isArray(req.body.perfiles)) {
                const perfiles = await perfil.findAll({
                    where: {
                        external_id: req.body.perfiles, // Buscar perfiles por sus UUIDs
                    },
                });

                if (perfiles.length) {
                    await result.setPerfiles(perfiles, { transaction }); // Asociar los perfiles a la inquietud
                }
            }

            await transaction.commit(); // Confirma la transacción
            return res.status(200).json({ message: "EXITO", code: 200 });
        } catch (error) {
            await transaction.rollback(); // Revertir la transacción en caso de error
            return res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }


    async modificar(req, res) {
        const transaction = await sequelize.transaction(); // Inicia la transacción

        try {
            const safeBody = inquietudSchema.safeParse(req.body);

            if (safeBody.error) {
                return res.status(400).json({ message: safeBody.error, tag: "Datos incorrectos", code: 400 });
            }

            const data = safeBody.data;

            // Buscar la inquietud existente
            const inquietudA = await inquietud.findOne({
                where: { external_id: req.params.external },
            });

            if (!inquietudA) {
                await transaction.rollback();
                return res.status(404).json({ message: "ERROR", tag: "Inquietud no encontrada", code: 404 });
            }

            // Actualizar los datos de la inquietud dentro de la transacción
            await inquietudA.update(data, { transaction });

            // Manejar la asociación de perfiles
            if (req.body.perfiles && Array.isArray(req.body.perfiles)) {
                const perfiles = await perfil.findAll({
                    where: {
                        external_id: req.body.perfiles, // Buscar perfiles por sus UUIDs
                    },
                });

                if (perfiles.length) {
                    await inquietudA.setPerfiles(perfiles, { transaction }); // Actualizar la relación con los perfiles
                }
            }

            await transaction.commit(); // Confirma la transacción
            return res.status(200).json({ message: "EXITO", code: 200 });
        } catch (error) {
            await transaction.rollback(); // Revertir la transacción en caso de error
            return res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }


    async inquietudesSegunPerfil(req, res) {
        try {
            const external_id = req.params.external;
    
            // Buscar la persona por su `external_id`
            const personaA = await persona.findOne({
                where: { external_id },
            });
    
            if (!personaA) {
                return res.status(404).json({ message: "ERROR", tag: "Persona no encontrada", code: 404 });
            }
    
            // Obtener los perfiles asociados a la persona
            const perfiles = await personaA.getPerfiles();
    
            if (!perfiles.length) {
                return res.status(404).json({ message: "ERROR", tag: "La persona no tiene perfiles asociados", code: 404 });
            }
    
            const inquietudes = await inquietud.findAll({
                attributes: ['titulo', 'descripcion', 'imagen', 'video', 'estado', 'external_id'], // Atributos de la inquietud
                include: [
                    {
                        model: perfil,
                        as: 'perfiles',
                        attributes: ['nombre', 'external_id'], // Atributos del perfil
                        where: {
                            external_id: perfiles.map((perfil) => perfil.external_id), // Filtrar por los perfiles asociados
                        },
                    },
                    {
                        model: respuesta,
                        as: 'respuestas',
                        attributes: ['descripcion', 'external_id'], // Atributos de la respuesta
                    },
                ],
                where: {
                    estado: true, // Filtrar inquietudes activas
                },
            });
    
            if (!inquietudes.length) {
                return res.status(404).json({ message: "No hay inquietudes para los perfiles de la persona", code: 404 });
            }
    
            const inquietudesFiltradas = inquietudes.filter((inquietud) =>
                inquietud.perfiles.length === 1 && perfiles.some((perfil) => perfil.external_id === inquietud.perfiles[0].external_id)
            );
    
            return res.status(200).json({ message: "Éxito", code: 200, data: inquietudesFiltradas });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }
    
}

module.exports = InquietudControl;