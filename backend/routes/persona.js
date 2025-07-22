const router = require('express').Router();

const personaControl = require('../app/controls/PersonaControl');


router.get('/', personaControl.listarPersonas);
router.get('/:external', personaControl.obtenerPersona);
router.post('/', personaControl.crearPersona);
router.post('/asociar-oficio', personaControl.asociarOficio);
//router.put('/:external', personaControl.modificar);

module.exports = router;