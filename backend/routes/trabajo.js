const router = require('express').Router();
const TrabajoControl = require('../app/controls/TrabajoControl');
const trabajoControl = new TrabajoControl();

// Ruta para listar trabajos
router.get('/', trabajoControl.listar);
// Ruta para guardar un trabajo 
router.post('/', trabajoControl.guardar);
// Ruta para obtener trabajos por oficio
router.get('/oficio/:id', trabajoControl.listarPorOficio);
router.get('/:external_id', trabajoControl.listarPorPersona);
router.get('/listarOfertas/:external_id', trabajoControl.listarPorTrabajo);


module.exports = router;