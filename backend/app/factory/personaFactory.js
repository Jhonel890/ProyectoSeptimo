// PersonaFactory.js
const { v4: uuidv4 } = require("uuid");
const { persona, cuenta, rol, oficio } = require("../models");

const PersonaFactory = {
    async crearPersonaConCuenta(data) {
        // Verificar si el rol existe
        const rolEncontrado = await rol.findOne({ where: { external_id: data.external_rol } });
        if (!rolEncontrado) throw new Error("Rol no encontrado");
    
        // Verificar si ya existe una cuenta con el mismo correo
        const cuentaA = await cuenta.findOne({ where: { correo: data.cuenta.correo } });
        if (cuentaA) {
            throw new Error("Correo ya existente");
        }
    
        // Crear la nueva persona con la cuenta asociada
        const nuevaPersona = await persona.create({
            external_id: uuidv4(),
            nombres: data.nombres,
            apellidos: data.apellidos,
            direccion: data.direccion,
            cedula: data.cedula,
            num_telefono: data.num_telefono,
            cuenta: {
                correo: data.cuenta.correo,
                clave: data.cuenta.clave,
            },
            rol_id: rolEncontrado.id,
        }, {
            include: [{ model: cuenta, as: "cuenta" }] // Incluir la relación con cuenta
        });
    
        return nuevaPersona;
    },

    async listarPersonas() {
        return await persona.findAll({
            include: [
                {
                    model: cuenta,
                    as: 'cuenta',
                    attributes: ['correo']
                },
                {
                    model: rol,
                    as: 'rol',
                    attributes: ['nombre']
                },
                {
                    model: oficio,
                    as: 'oficios', // <-- Usa el alias definido en el modelo
                    attributes: ['nombre', 'descripcion'],
                    through: { attributes: [] }
                }
            ],
            attributes: ['nombres', 'apellidos', 'direccion', 'cedula', 'external_id']
        });
    },
    
    

    async obtenerPersonaPorExternalId(external_id) {
        return await persona.findOne({
            where: { external_id },
            include: [
                { model: cuenta, as: 'cuenta', attributes: ['correo'] },
                { model: rol, as: 'rol', attributes: ['nombre'] }
            ],
            attributes: ['nombres', 'apellidos', 'direccion', 'cedula', 'external_id']
        });
    },

    async asociarOficio (external_id_persona, external_id_oficio) {
        // Buscar la persona por su external_id
        const personaEncontrada = await persona.findOne({ where: { external_id: external_id_persona } });
        if (!personaEncontrada) throw new Error("Persona no encontrada");

        // Buscar el oficio por su external_id
        const oficioEncontrado = await oficio.findOne({ where: { external_id: external_id_oficio } });
        if (!oficioEncontrado) throw new Error("Oficio no encontrado");

        // Asociar el oficio a la persona
        await personaEncontrada.addOficio(oficioEncontrado);
        
        return { message: "Oficio asociado a la persona con éxito" };
    }
};

module.exports = PersonaFactory;
