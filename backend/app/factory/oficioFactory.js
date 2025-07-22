const { oficio, persona, trabajo } = require('../models');
const { v4: uuidv4 } = require('uuid');

class OficioFactory {
    /**
     * Crear un oficio con relaciones opcionales
     * @param {Object} data - Datos del oficio
     * @returns {Object} - El oficio creado
     */
    static async crearOficioConRelaciones(data) {
        // Crear el oficio
        const nuevoOficio = await oficio.create({
            nombre: data.nombre,
            descripcion: data.descripcion,
            external_id: uuidv4(),
        });

        // Asociar personas al oficio (si se proporcionan)
        if (data.personas && data.personas.length > 0) {
            const personas = await persona.findAll({ where: { external_id: data.personas } });
            await nuevoOficio.addPersonas(personas);
        }

        // Asociar trabajos al oficio (si se proporcionan)
        if (data.trabajos && data.trabajos.length > 0) {
            const trabajos = await trabajo.findAll({ where: { external_id: data.trabajos } });
            await nuevoOficio.addTrabajos(trabajos);
        }

        return nuevoOficio;
    }

    /**
     * Obtener un oficio por su external_id
     * @param {String} external_id - Identificador externo del oficio
     * @returns {Object} - El oficio encontrado
     */
    static async obtenerOficioPorExternalId(external_id) {
        return await oficio.findOne({
            where: { external_id },
            include: ['personas', 'trabajos'], // Relaciones definidas en el modelo
        });
    }

    /**
     * Listar todos los oficios
     * @returns {Array} - Lista de oficios
     */
    static async listarOficios() {
        return await oficio.findAll({
            include: ['personas', 'trabajos'],
        });
    }
}

module.exports = OficioFactory;