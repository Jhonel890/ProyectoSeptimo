const PersonaFactory = require("../factory/personaFactory");

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
    try {
        const { external_id } = req.params;
        const persona = await PersonaFactory.obtenerPersonaPorExternalId(external_id);

        if (!persona) {
            return res.status(404).json({
                message: "Persona no encontrada"
            });
        }

        res.status(200).json({
            message: "Persona encontrada",
            data: persona
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener persona",
            error: error.message
        });
    }
};

const asociarOficio = async (req, res) => {
    try {
        const { external_id_persona, external_id_oficio } = req.body;
        const resultado = await PersonaFactory.asociarOficio(external_id_persona, external_id_oficio);
        res.status(200).json({
            message: "Oficio asociado correctamente a la persona",
            data: resultado
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al asociar oficio a la persona",
            error: error.message
        });
    }
}

module.exports = {
    crearPersona,
    listarPersonas,
    obtenerPersona,
    asociarOficio
};
