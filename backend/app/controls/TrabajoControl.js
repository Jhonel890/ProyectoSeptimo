"use strict";

const models = require('../models');
const Trabajo = models.trabajo;
const Persona = models.persona;
const Oferta = models.oferta;
const Rol = models.rol;
const Oficio = models.oficio;
const sequelize = models.sequelize; // Añadido para usar transacciones
const { v4: uuidv4 } = require('uuid'); // Para generar UUIDs

class TrabajoControl {
    async listar(req, res) {
        try {
            const { external_id } = req.params;
    
            // 1. Buscar el oficio y sus trabajos en una sola consulta
            const oficio = await Oficio.findOne({
                where: { external_id },
                include: [{
                    model: Trabajo,
                    as: 'trabajos',
                    through: { attributes: [] }, // Ocultar tabla intermedia
                    include: [{
                        model: Persona,
                        as: 'persona',
                        attributes: ['nombres', 'apellidos', 'num_telefono', 'external_id']
                    }]
                }],
                attributes: ['external_id', 'nombre', 'descripcion']
            });
    
            if (!oficio) {
                return res.status(404).json({
                    message: 'Oficio no encontrado',
                    code: 404,
                    data: null
                });
            }
    
            // 2. Formatear respuesta
            res.status(200).json({
                message: oficio.trabajos.length > 0 
                    ? 'Trabajos encontrados' 
                    : 'No hay trabajos para este oficio',
                code: 200,
                data: {
                    oficio: {
                        id: oficio.external_id,
                        nombre: oficio.nombre,
                        descripcion: oficio.descripcion
                    },
                    cantidad_trabajos: oficio.trabajos.length,
                    trabajos: oficio.trabajos.map(t => ({
                        id: t.external_id,
                        titulo: t.titulo_trabajo,
                        descripcion: t.descripcion,
                        estado: t.estado,
                        fechas: {
                            inicio: t.fecha_inicio,
                            fin: t.fecha_fin
                        },
                        creado: t.createdAt,
                        contratista: {
                            id: t.persona.external_id,
                            nombre: `${t.persona.nombres} ${t.persona.apellidos}`,
                            telefono: t.persona.num_telefono
                        }
                    }))
                }
            });
    
        } catch (error) {
            console.error('Error en listarPorOficio:', error);
            res.status(500).json({
                message: 'Error al listar trabajos',
                code: 500,
                error: error.message
            });
        }
    }

    async listarPorPersona(req, res) {
        try {
            const { external_id } = req.params;
    
            // 1. Buscar la persona por su external_id
            const persona = await Persona.findOne({
                where: { external_id },
                attributes: ['id', 'external_id', 'nombres', 'apellidos']
            });
    
            if (!persona) {
                return res.status(404).json({
                    message: 'Persona no encontrada',
                    code: 404,
                    data: null
                });
            }
    
            // 2. Obtener los trabajos asociados a esta persona
            const trabajos = await Trabajo.findAll({
                where: { id_persona: persona.id },
                include: [
                    {
                        model: Oficio,
                        as: 'oficios',
                        attributes: ['external_id', 'nombre', 'descripcion'],
                        through: { attributes: [] }
                    },
                    {
                        model: Persona,
                        as: 'persona',
                        attributes: ['nombres', 'apellidos', 'num_telefono', 'external_id']
                    }
                ],
                attributes: [
                    'external_id',
                    'titulo_trabajo',
                    'descripcion',
                    'estado',
                    'fecha_inicio',
                    'fecha_fin',
                    'createdAt'
                ],
                order: [['createdAt', 'DESC']]
            });
    
            // 3. Formatear la respuesta
            const response = {
                message: 'Trabajos encontrados',
                code: 200,
                data: {
                    persona: {
                        id: persona.external_id,
                        nombre: `${persona.nombres} ${persona.apellidos}`
                    },
                    cantidad_trabajos: trabajos.length,
                    trabajos: trabajos.map(t => ({
                        id: t.external_id,
                        titulo: t.titulo_trabajo,
                        descripcion: t.descripcion,
                        estado: t.estado,
                        fechas: {
                            inicio: t.fecha_inicio,
                            fin: t.fecha_fin
                        },
                        creado: t.createdAt,
                        oficios: t.oficios.map(o => ({
                            id: o.external_id,
                            nombre: o.nombre,
                            descripcion: o.descripcion
                        }))
                    }))
                }
            };
    
            res.status(200).json(response);
    
        } catch (error) {
            console.error('Error en listarPorPersona:', error);
            res.status(500).json({
                message: 'Error al listar trabajos por persona',
                code: 500,
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
    
    async guardar(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const { id_persona, titulo_trabajo, descripcion, fecha_inicio, fecha_fin, estado, oficios } = req.body;
    
            // Validaciones básicas
            if (!id_persona || !titulo_trabajo || !fecha_inicio) {
                await transaction.rollback();
                return res.status(400).json({ 
                    message: 'Faltan campos requeridos: id_persona, titulo_trabajo y fecha_inicio son obligatorios', 
                    code: 400 
                });
            }
    
            // Verificar persona y rol
            const persona = await Persona.findOne({
                where: { id: id_persona },
                include: { model: Rol, as: 'rol' },
                transaction
            });
    
            if (!persona) {
                await transaction.rollback();
                return res.status(404).json({ 
                    message: 'Persona no encontrada', 
                    code: 404 
                });
            }
    
            if (persona.rol.nombre.toLowerCase() !== 'contratista') {
                await transaction.rollback();
                return res.status(403).json({ 
                    message: 'Solo los contratistas pueden crear trabajos', 
                    code: 403 
                });
            }
    
            // Crear el trabajo
            const nuevoTrabajo = await Trabajo.create({
                titulo_trabajo,
                descripcion,
                fecha_inicio: new Date(fecha_inicio),
                fecha_fin: fecha_fin ? new Date(fecha_fin) : null,
                estado: estado || 'Postulado',
                id_persona,
                external_id: uuidv4()
            }, { transaction });
    
            // Asociar oficios si existen
            if (oficios && Array.isArray(oficios) && oficios.length > 0) {
                // Verificar que los oficios existan
                const oficiosExistentes = await Oficio.findAll({
                    where: { id: oficios },
                    transaction
                });
    
                if (oficiosExistentes.length !== oficios.length) {
                    const oficiosNoEncontrados = oficios.filter(id => 
                        !oficiosExistentes.some(o => o.id === id)
                    );
                    
                    await transaction.rollback();
                    return res.status(400).json({ 
                        message: 'Algunos oficios no existen', 
                        code: 400,
                        oficios_no_encontrados: oficiosNoEncontrados
                    });
                }
    
                // Asociar oficios al trabajo
                await nuevoTrabajo.addOficios(oficiosExistentes, { transaction });
            }
    
            // Commit de la transacción
            await transaction.commit();
    
            // Obtener el trabajo con relaciones para la respuesta (fuera de la transacción)
            const trabajoCompleto = await Trabajo.findOne({
                where: { id: nuevoTrabajo.id },
                include: [
                    {
                        model: Oficio,
                        as: 'oficios',
                        attributes: ['id', 'nombre', 'descripcion']
                    },
                    {
                        model: Persona,
                        as: 'persona',
                        attributes: ['nombres', 'apellidos']
                    }
                ]
            });
    
            return res.status(201).json({
                message: 'Trabajo creado exitosamente',
                code: 201,
                data: trabajoCompleto
            });
    
        } catch (error) {
            // Solo hacer rollback si la transacción está activa
            if (transaction && !transaction.finished) {
                await transaction.rollback();
            }
            
            console.error('Error en guardar trabajo:', error);
            return res.status(500).json({
                message: "Error al guardar trabajo",
                code: 500,
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    async listarPorOficio(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const { external_id_oficio } = req.params;

            // Verificar si el oficio existe
            const oficio = await Oficio.findOne({ 
                where: { external_id: external_id_oficio },
                transaction
            });
            
            if (!oficio) {
                await transaction.rollback();
                return res.status(404).json({ 
                    message: 'Oficio no encontrado', 
                    code: 404 
                });
            }

            // Listar trabajos asociados al oficio
            const trabajos = await Trabajo.findAll({
                include: [
                    {
                        model: Oficio,
                        as: 'oficios',
                        where: { id: oficio.id },
                        attributes: ['id', 'nombre', 'descripcion'],
                        through: { attributes: [] } // Ocultar tabla intermedia
                    },
                    {
                        model: Persona,
                        as: 'persona',
                        attributes: ['nombres', 'apellidos']
                    }
                ],
                attributes: ['id', 'external_id', 'titulo_trabajo', 'descripcion', 'estado', 'fecha_inicio', 'fecha_fin'],
                transaction
            });

            await transaction.commit();
            res.status(200).json({ 
                message: "Éxito", 
                code: 200, 
                data: {
                    oficio: {
                        id: oficio.id,
                        nombre: oficio.nombre,
                        descripcion: oficio.descripcion
                    },
                    trabajos: trabajos
                } 
            });
        } catch (error) {
            await transaction.rollback();
            console.error('Error en listarPorOficio:', error);
            res.status(500).json({ 
                message: "Error interno del servidor", 
                code: 500, 
                error: error.message 
            });
        }
    }

    async listarPorTrabajo(req, res) {
        try {
            const { external_id } = req.params;
    
            if (!external_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Se requiere el external_id del trabajo'
                });
            }
    
            // Buscar el trabajo por external_id
            const trabajo = await Trabajo.findOne({
                where: { external_id },
                attributes: ['id', 'external_id', 'titulo_trabajo']
            });
    
            if (!trabajo) {
                return res.status(404).json({
                    success: false,
                    message: 'Trabajo no encontrado'
                });
            }
    
            // Buscar las ofertas asociadas al trabajo
            const ofertas = await Oferta.findAll({
                where: { id_trabajo: trabajo.id },
                include: [
                    {
                        model: Persona,
                        as: 'trabajador',
                        attributes: ['external_id', 'nombres', 'apellidos'] // sin foto_perfil
                    }
                ],
                attributes: [
                    'external_id',
                    'precondiciones',
                    'hora_visita',
                    'fecha_visita',
                    'estado',
                    'createdAt'
                ],
                order: [['createdAt', 'DESC']]
            });
    
            // Formar la respuesta
            return res.status(200).json({
                success: true,
                message: ofertas.length > 0 
                    ? 'Ofertas encontradas' 
                    : 'No hay ofertas para este trabajo',
                data: {
                    trabajo: {
                        id: trabajo.external_id,
                        titulo: trabajo.titulo_trabajo
                    },
                    total: ofertas.length,
                    ofertas: ofertas.map(oferta => ({
                        id: oferta.external_id,
                        precondiciones: oferta.precondiciones,
                        hora_visita: oferta.hora_visita,
                        fecha_visita: oferta.fecha_visita,
                        estado: oferta.estado,
                        fecha_creacion: oferta.createdAt,
                        trabajador: oferta.trabajador ? {
                            id: oferta.trabajador.external_id,
                            nombre: `${oferta.trabajador.nombres} ${oferta.trabajador.apellidos}`
                        } : null
                    }))
                }
            });
    
        } catch (error) {
            console.error('Error en listarPorTrabajo:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al listar ofertas',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    
    
}

module.exports = TrabajoControl;