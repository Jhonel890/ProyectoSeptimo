const PersonaFactory = require("../factory/personaFactory");
const { cuenta, rol, oficio, persona } = require("../models");

const crearPersona = async (req, res) => {
    try {
        const nuevaPersona = await PersonaFactory.crearPersonaConCuenta(req.body);
        res.status(201).json({
            message: "Persona creada correctamente",
            external_id: nuevaPersona.external_id
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al crear persona",
            error: error.message
        });
    }
};

const listarPersonas = async (req, res) => {
    try {
        const resultado = await PersonaFactory.listarPersonas();
        if (resultado.length === 0) {
            return res.status(404).json({
                message: "No se encontraron personas"
            });
        }
        // Formatear el resultado para incluir external_id
        resultado.forEach(persona => {
            persona.external_id = persona.external_id || persona.cuenta.external_id;
        }
        );
        res.status(200).json(resultado);

    } catch (error) {
        res.status(500).json({
            message: "Error al listar personas",
            error: error.message
        });
    }

};

const obtenerPersona = async (req, res) => {
    const external = req.params.external;

    try {
        const lista = await persona.findOne({
            where: { external_id: external },
            include: [
                { model: cuenta, as: 'cuenta', attributes: ['correo'] },
                { model: rol, as: 'rol', attributes: ['nombre'] },
                { 
                    model: oficio, // Relación con el modelo oficio
                    as: 'oficios', // Alias definido en la relación
                    attributes: ['nombre', 'external_id'] // Campos que deseas incluir
                }
            ]
        });

        if (!lista) {
            res.status(404);
            return res.json({ message: "Recurso no encontrado", code: 404, data: {} });
        }

        res.status(200);
        res.json({ message: "Éxito", code: 200, data: lista });
    } catch (error) {
        res.status(500);
        res.json({ message: "Error interno del servidor", code: 500, error: error.message });
    }
};

const asociarOficio = async (req, res) => {
    try {
        const { external_id_persona, external_id_oficios } = req.body;

        // Buscar la persona por su external_id
        const personaEncontrada = await persona.findOne({
            where: { external_id: external_id_persona }
        });

        if (!personaEncontrada) {
            return res.status(404).json({
                message: "Persona no encontrada"
            });
        }

        // Buscar los oficios por sus external_id
        const oficios = await oficio.findAll({
            where: { external_id: external_id_oficios }
        });

        if (oficios.length === 0) {
            return res.status(404).json({
                message: "No se encontraron oficios válidos"
            });
        }

        // Obtener los oficios ya asociados a la persona
        const oficiosActuales = await personaEncontrada.getOficios();

        // Convertimos a un array de external_id para comparar
        const idsActuales = oficiosActuales.map(o => o.external_id);
        const idsNuevos = oficios.map(o => o.external_id);

        // Validamos si ya tiene todos los oficios que se intentan asociar
        const yaTieneTodos = idsNuevos.every(id => idsActuales.includes(id));

        if (yaTieneTodos) {
            return res.status(400).json({
                message: "La persona ya tiene estos oficios asociados"
            });
        }

        // Filtrar solo los oficios que aún no están asociados
        const oficiosNuevos = oficios.filter(o => !idsActuales.includes(o.external_id));

        // Asociar solo los oficios nuevos
        await personaEncontrada.addOficios(oficiosNuevos);

        res.status(200).json({
            message: "Oficios asociados correctamente a la persona",
            data: {
                persona: personaEncontrada.external_id,
                oficios: oficiosNuevos.map(o => o.external_id)
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al asociar oficios a la persona",
            error: error.message
        });
    }
};



module.exports = {
    crearPersona,
    listarPersonas,
    obtenerPersona,
    asociarOficio
};
