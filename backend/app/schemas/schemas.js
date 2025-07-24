const zod = require('zod');

const cuentaSchema = zod.object({
    correo: zod.string().email().max(80),
    clave: zod.string().min(8).max(20),
    estado: zod.boolean().optional()
});

const personaSchema = zod.object({
    nombres: zod.string().max(120),
    apellidos: zod.string().max(120),
    direccion: zod.string().max(200).nullable(),
    cedula: zod.string().max(10),
    monedas: zod.number().nullable().optional(),
    cuenta: cuentaSchema,
});

const rolSchema = zod.object({
    nombre: zod.string()
});





module.exports = {
    cuentaSchema,
    personaSchema,
    rolSchema
};