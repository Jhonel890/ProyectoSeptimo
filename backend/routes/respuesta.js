const router = require('express').Router();

const RespuestaControl = require('../app/controls/RespuestaControl');

const respuestaControl = new RespuestaControl();

router.get('/', respuestaControl.listar);
router.get('/:external', respuestaControl.obtener);
router.post('/', respuestaControl.guardar);
router.put('/:external', respuestaControl.modificar);
router.get('/misRespuestas/:persona', respuestaControl.mis_respuestas);


module.exports = router;
