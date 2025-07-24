"use strict";

const models = require('../models');
const Trabajo = models.trabajo;
const Persona = models.persona;
const Rol = models.rol;
const Oficio = models.oficio;

class TrabajoControl {
    async listar(req, res) {
        try {
            const lista = await Trabajo.findAll({
                include: [
                    { model: models.contrato, as: 'contrato', attributes: ['horas_trabajo', 'trabajador', 'external_contratista', 'estado'] },
                    { model: models.oficio, as: 'oficios', attributes: ['nombre'] },
                ],
                attributes: ['external_id']
            });
            res.status(200).json({ message: "Éxito", code: 200, data: lista });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async guardar(req, res) {
        try {
            const { id_persona, titulo_trabajo, descripcion, fecha_inicio, fecha_fin, estado, oficios } = req.body;
    
            // 1. Obtener la persona con su rol
            const persona = await Persona.findOne({
                where: { id: id_persona },
                include: { model: Rol, as: 'rol', attributes: ['nombre'] }
            });
    
            if (!persona) {
                return res.status(404).json({ message: 'Persona no encontrada', code: 404 });
            }
    
            // 2. Verificar rol
            if (persona.rol.nombre.toLowerCase() !== 'contratista') {
                return res.status(403).json({ message: 'No tienes permisos para crear trabajos', code: 403 });
            }
    
            // 3. Crear trabajo si es contratista
            const nuevoTrabajo = await Trabajo.create({
                titulo_trabajo,
                descripcion,
                fecha_inicio,
                fecha_fin,
                estado: estado || 'Postulado',
                id_persona
            });
    
            // 4. Asociar múltiples oficios al trabajo
            if (oficios && Array.isArray(oficios) && oficios.length > 0) {
                await nuevoTrabajo.addOficios(oficios); // `oficios` es un array de IDs
            }
    
            res.status(201).json({
                message: 'Trabajo creado exitosamente',
                data: nuevoTrabajo
            });
    
        } catch (error) {
            res.status(500).json({
                message: "Error al guardar trabajo",
                error: error.message
            });
        }
    }

}

module.exports = TrabajoControl;