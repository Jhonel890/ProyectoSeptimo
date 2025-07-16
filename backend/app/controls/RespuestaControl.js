'use strict';

const { inquietud, respuesta, persona } = require('../models');
const { respuestaSchema } = require('../schemas/schemas');
const uuid = require('uuid');

class RespuestaControl {
    async listar(req, res) {
        try {
            const lista = await respuesta.findAll({
                attributes: ['descripcion', 'imagen', 'video', 'estado', 'external_id'],
                include: [
                    { model: inquietud, as: 'inquietud', attributes: ['titulo', "descripcion"] },
                    { model: persona, as: 'persona', attributes: ['nombres', 'apellidos', 'external_id'] }
                ]
            });
            res.status(200).json({ message: "Éxito", code: 200, data: lista });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async obtener(req, res) {
        try {
            const result = await respuesta.findOne({
                where: {
                    external_id: req.params.external
                },
                attributes: ['descripcion', 'imagen', 'video', 'estado', 'external_id'],
                include: [
                    { model: inquietud, as: 'inquietud', attributes: ['titulo', "descripcion"] },
                    { model: persona, as: 'persona', attributes: ['nombres', 'apellidos', 'external_id'] }
                ]
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
            // Validar el cuerpo de la solicitud
            const safeBody = respuestaSchema.safeParse(req.body);
            if (safeBody.error) {
                return res.status(400).json({ message: safeBody.error, tag: "Datos incorrectos", code: 400 });
            }
    
            const { inquietud: inquietudId, persona: personaId, ...restoDatos } = safeBody.data;
    
            // Buscar la inquietud
            const inquietudA = await inquietud.findOne({ where: { external_id: inquietudId } });
            if (!inquietudA) {
                return res.status(404).json({ message: "ERROR", tag: "Inquietud no encontrada", code: 404 });
            }
    
            // Buscar la persona
            const personaA = await persona.findOne({ 
                where: { external_id: personaId },
                attributes: ['id', 'monedas', 'external_id'] // Cambiado de 'coins' a 'monedas'
            });
            
            if (!personaA) {
                return res.status(404).json({ message: "ERROR", tag: "Persona no encontrada", code: 404 });
            }
    
            // Preparar los datos para guardar
            const data = {
                ...restoDatos,
                id_persona: personaA.id,
                id_inquietud: inquietudA.id
            };
    
            // Crear la respuesta
            const nuevaRespuesta = await respuesta.create(data);
            if (!nuevaRespuesta) {
                return res.status(401).json({ message: "ERROR", tag: "No se puede crear", code: 401 });
            }
    
            // Actualizar el estado de la inquietud
            const actualizarInquietud = await inquietud.update(
                { estado: false },
                { where: { external_id: inquietudId } }
            );
            if (!actualizarInquietud) {
                return res.status(401).json({ message: "ERROR", tag: "No se puede modificar", code: 401 });
            }
    
            // Incrementar las monedas de la persona
            const monedasActuales = personaA.monedas || 0; // Cambiado de coins a monedas
            const actualizarPersona = await persona.update(
                { monedas: monedasActuales + 5 }, // Cambiado de coins a monedas
                { 
                    where: { external_id: personaId }
                }
            );
            
            if (!actualizarPersona) {
                return res.status(401).json({ message: "ERROR", tag: "No se puede modificar", code: 401 });
            }
    
            // Respuesta final
            return res.status(201).json({ 
                message: "ÉXITO", 
                code: 201,
                monedasActualizadas: monedasActuales + 5
            });
    
        } catch (error) {
            console.error("Error en guardar:", error);
            return res.status(500).json({ message: "Error interno del servidor", code: 500 });
        }
    }

    async modificar(req, res) {
        const safeBody = respuestaSchema.safeParse(req.body);
        if (safeBody.error) {
            res.status(400).json({ message: safeBody.error, tag: "Datos incorrectos", code: 400 });
        } else {
            const data = safeBody.data;

            const personaA = await persona.findOne({
                where: { external_id: req.body.persona },
            });

            if (!personaA) {
                res.status(404).json({ message: "ERROR", tag: "Persona no encontrada", code: 404 });
            }

            data.id_persona = personaA.id;

            const result = await respuesta.update(data, {
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
    }

    async mis_respuestas(req, res) {
        try {
            const id_persona = req.params.persona;

            const personaA = await persona.findOne({
                where: { external_id: id_persona },
            });

            if (!personaA) {
                res.status(404).json({ message: "ERROR", tag: "Persona no encontrada", code: 404 });
            }

            const lista = await inquietud.findAll({
                where: { id_persona: personaA.id },
                attributes: ['titulo','descripcion', 'imagen', 'video', 'estado', 'external_id'],
                include: [
                    { model: respuesta, as: 'respuestas', attributes: ["descripcion"] },
                    { model: persona, as: 'persona', attributes: ['nombres', 'apellidos', 'external_id'] }
                ]
            });

            console.log(lista);
            if (lista.respuestas) {
                res.status(404).json({ message: "ERROR", tag: "No encontrado", code: 404 });
            } else {
                res.status(200).json({ message: "Éxito", code: 200, data: lista });
            }
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }
}

module.exports = RespuestaControl;