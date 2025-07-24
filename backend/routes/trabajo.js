const router = require('express').Router();
const TrabajoControl = require('../app/controls/TrabajoControl');
const trabajoControl = new TrabajoControl();

// Ruta para listar trabajos
router.get('/', trabajoControl.listar);
// Ruta para guardar un trabajo 
router.post('/', trabajoControl.guardar);

module.exports = router;