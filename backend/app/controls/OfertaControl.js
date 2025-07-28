"use strict";

const models = require('../models');
const Oferta = models.oferta;
const Trabajo = models.trabajo;
const Persona = models.persona;
const { v4: uuidv4 } = require('uuid');
const sequelize = models.sequelize;

class OfertaControl {
    /**
     * Crear una nueva oferta/postulación
     */
    async crear(req, res) {
        const transaction = await sequelize.transaction();
        try {
          const { 
            external_id_trabajo, 
            external_id_trabajador,
            hora_visita, 
            fecha_visita, 
            precondiciones 
          } = req.body;
      
          // Validaciones básicas
          if (!external_id_trabajo || !external_id_trabajador || !hora_visita || !fecha_visita) {
            await transaction.rollback();
            return res.status(400).json({
              message: 'Faltan campos requeridos',
              code: 400,
              campos_requeridos: [
                'external_id_trabajo',
                'external_id_trabajador', 
                'hora_visita',
                'fecha_visita'
              ]
            });
          }
      
          // Buscar el trabajador
          const trabajador = await Persona.findOne({
            where: { external_id: external_id_trabajador },
            include: { model: models.rol, as: 'rol' },
            transaction
          });
      
          if (!trabajador) {
            await transaction.rollback();
            return res.status(404).json({
              message: 'Trabajador no encontrado',
              code: 404
            });
          }
      
          // Verificar rol de trabajador
          if (trabajador.rol.nombre.toLowerCase() !== 'trabajador') {
            await transaction.rollback();
            return res.status(403).json({
              message: 'Solo los trabajadores pueden postular a trabajos',
              code: 403
            });
          }
      
          // Buscar el trabajo
          const trabajo = await Trabajo.findOne({
            where: { external_id: external_id_trabajo },
            transaction
          });
      
          if (!trabajo) {
            await transaction.rollback();
            return res.status(404).json({
              message: 'Trabajo no encontrado',
              code: 404
            });
          }
      
          // VALIDAR si ya existe una postulación para ese trabajador y trabajo
          const postulacionExistente = await Oferta.findOne({
            where: {
              id_trabajo: trabajo.id,
              id_persona: trabajador.id,
            },
            transaction
          });
      
          if (postulacionExistente) {
            await transaction.rollback();
            return res.status(400).json({
              message: 'Ya has postulado a este trabajo anteriormente',
              code: 400
            });
          }
      
          // Crear la oferta/postulación
          const nuevaOferta = await Oferta.create({
            hora_visita: new Date(`${fecha_visita}T${hora_visita}`),
            fecha_visita: new Date(fecha_visita),
            precondiciones: precondiciones || null,
            estado: 'Postulado',
            id_trabajo: trabajo.id,
            id_persona: trabajador.id,
            external_id: uuidv4()
          }, { transaction });
      
          await transaction.commit();
      
          // Obtener datos para respuesta
          const ofertaCompleta = await Oferta.findOne({
            where: { id: nuevaOferta.id },
            include: [
              {
                model: Trabajo,
                as: 'trabajo',
                attributes: ['external_id', 'titulo_trabajo']
              },
              {
                model: Persona,
                as: 'trabajador',
                attributes: ['external_id', 'nombres', 'apellidos']
              }
            ]
          });
      
          return res.status(201).json({
            message: 'Postulación creada exitosamente',
            code: 201,
            data: ofertaCompleta
          });
      
        } catch (error) {
          await transaction.rollback();
          console.error('Error en crear oferta:', error);
          return res.status(500).json({
            message: 'Error al crear postulación',
            code: 500,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
          });
        }
      }
      

    /**
     * Listar ofertas por trabajo (usando external_id)
     */
    async listarPorTrabajo(req, res) {
        try {
            const { external_id } = req.params;

            const trabajo = await Trabajo.findOne({
                where: { external_id },
                attributes: ['id']
            });

            if (!trabajo) {
                return res.status(404).json({
                    message: 'Trabajo no encontrado',
                    code: 404
                });
            }

            const ofertas = await Oferta.findAll({
                where: { id_trabajo: trabajo.id },
                include: [
                    {
                        model: Persona,
                        as: 'trabajador',
                        attributes: ['nombres', 'apellidos', 'external_id']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            return res.status(200).json({
                message: 'Ofertas encontradas',
                code: 200,
                data: ofertas
            });

        } catch (error) {
            console.error('Error en listar ofertas por trabajo:', error);
            return res.status(500).json({
                message: 'Error al listar ofertas',
                code: 500,
                error: error.message
            });
        }
    }

    /**
     * Listar ofertas por persona (usando external_id)
     */
    async listarPorPersona(req, res) {
        try {
            const { external_id } = req.params;

            const persona = await Persona.findOne({
                where: { external_id },
                attributes: ['id']
            });

            if (!persona) {
                return res.status(404).json({
                    message: 'Persona no encontrada',
                    code: 404
                });
            }

            const ofertas = await Oferta.findAll({
                where: { id_persona: persona.id },
                include: [
                    {
                        model: Trabajo,
                        as: 'trabajo',
                        attributes: ['titulo_trabajo', 'external_id']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            return res.status(200).json({
                message: 'Ofertas encontradas',
                code: 200,
                data: ofertas
            });

        } catch (error) {
            console.error('Error en listar ofertas por persona:', error);
            return res.status(500).json({
                message: 'Error al listar ofertas',
                code: 500,
                error: error.message
            });
        }
    }

    /**
     * Listar todas las ofertas
     */
    async listar(req, res) {
        try {
            const ofertas = await Oferta.findAll({
                include: [
                    {
                        model: Trabajo,
                        as: 'trabajo',
                        attributes: ['titulo_trabajo', 'external_id']
                    },
                    {
                        model: Persona,
                        as: 'trabajador',
                        attributes: ['nombres', 'apellidos', 'external_id']
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit: 100
            });

            return res.status(200).json({
                message: 'Ofertas encontradas',
                code: 200,
                data: ofertas
            });

        } catch (error) {
            console.error('Error en listar ofertas:', error);
            return res.status(500).json({
                message: 'Error al listar ofertas',
                code: 500,
                error: error.message
            });
        }
    }
}

module.exports = OfertaControl;