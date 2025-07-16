const router = require('express').Router();

const RolControl = require('../app/controls/RolControl');

const rolControl = new RolControl();

router.get('/', rolControl.listar);
router.post('/', rolControl.guardar);
router.get('/:external', rolControl.obtener);
router.put('/:external', rolControl.modificar);


//metodoss y demas

module.exports = router;