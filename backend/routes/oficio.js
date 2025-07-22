const express = require('express');
const router = express.Router();
const OficioControl = require('../app/controls/OficioControl');

// Ruta para crear un oficio
router.post('/', (req, res) => OficioControl.guardar(req, res));

// Ruta para obtener un oficio por external_id
router.get('/:external_id', (req, res) => OficioControl.obtener(req, res));

// Ruta para listar todos los oficios
router.get('/', (req, res) => OficioControl.listar(req, res));

module.exports = router;