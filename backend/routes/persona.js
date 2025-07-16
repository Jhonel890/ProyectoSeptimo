const router = require('express').Router();

const PersonaControl = require('../app/controls/PersonaControl');

const personaControl = new PersonaControl();

router.get('/', personaControl.listar);
router.get('/:external', personaControl.obtener);
router.post('/', personaControl.guardar);
router.put('/:external', personaControl.modificar);
router.get('/status/:external', personaControl.isPerfilCompleto);
router.post('/status/change/:external', personaControl.completarPerfil);
router.get('/misCoins/:external', personaControl.misCoins);
router.put('/modificarPerfiles/:external', personaControl.cambiarPerfiles);

module.exports = router;
//metodoss y demas