const router = require('express').Router();

const PerfilControl = require('../app/controls/PerfilControl');

const perfilControl = new PerfilControl();

router.get('/', perfilControl.listar);
router.get('/:external', perfilControl.obtener);
router.post('/', perfilControl.guardar);
router.put('/:external', perfilControl.modificar);


module.exports = router;
