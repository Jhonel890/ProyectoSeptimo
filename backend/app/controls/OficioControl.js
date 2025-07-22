const OficioFactory = require("../factory/oficioFactory");

class OficioControl {
    async guardar(req, res) {
        try {
            const data = req.body;

            // Validar datos requeridos
            if (!data.nombre) {
                return res.status(400).json({ message: "El nombre del oficio es obligatorio", code: 400 });
            }

            const nuevoOficio = await OficioFactory.crearOficioConRelaciones(data);
            res.status(201).json({ message: "Oficio creado con éxito", code: 201, data: nuevoOficio });
        } catch (error) {
            res.status(500).json({ message: "Error al crear el oficio", code: 500, error: error.message });
        }
    }

    /**
     * Obtener un oficio por su external_id
     */
    async obtener(req, res) {
        try {
            const { external_id } = req.params;

            const oficioEncontrado = await OficioFactory.obtenerOficioPorExternalId(external_id);
            if (!oficioEncontrado) {
                return res.status(404).json({ message: "Oficio no encontrado", code: 404 });
            }

            res.status(200).json({ message: "Oficio encontrado", code: 200, data: oficioEncontrado });
        } catch (error) {
            res.status(500).json({ message: "Error al obtener el oficio", code: 500, error: error.message });
        }
    }

    /**
     * Listar todos los oficios
     */
    async listar(req, res) {
        try {
            const oficios = await OficioFactory.listarOficios();
            res.status(200).json({ message: "Lista de oficios obtenida con éxito", code: 200, data: oficios });
        } catch (error) {
            res.status(500).json({ message: "Error al listar los oficios", code: 500, error: error.message });
        }
    }
}

module.exports = new OficioControl();