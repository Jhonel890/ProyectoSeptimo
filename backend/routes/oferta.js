const express = require('express');
const router = express.Router();
const OfertaControl = require('../app/controls/OfertaControl');

// Crear instancia del controlador
const controlador = new OfertaControl();

// Ruta para crear una oferta
router.post('/', (req, res) => controlador.crear(req, res));

// Ruta para listar ofertas por trabajo (usando external_id)
router.get('/trabajo/:external_id', (req, res) => controlador.listarPorTrabajo(req, res));

// Ruta para listar ofertas por persona (usando external_id)
router.get('/persona/:external_id', (req, res) => controlador.listarPorPersona(req, res));

// Ruta para listar todas las ofertas
router.get('/', (req, res) => controlador.listar(req, res));

module.exports = router;