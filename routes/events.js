/*
    Events Routes
    /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');
const { fieldValidator } = require('../middlewares/field-validator')
const { jwtValidator } = require('../middlewares/jwt-validator');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const router = Router();

router.use( jwtValidator );

//Todas tienen que pasar por la validacion del token
router.get('/', getEventos );

//crear evento
router.post(
    '/',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','La fecha de inicio es obligatorio').custom( isDate),
        check('start','La fecha de finalización es obligatorio').custom( isDate),
        fieldValidator
    ],
    crearEvento );

//actualizar evento
router.put(
    '/:id', 
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','La fecha de inicio es obligatorio').custom( isDate),
        check('start','La fecha de finalización es obligatorio').custom( isDate),
        fieldValidator
    ],
    actualizarEvento );

//eliminar evento
router.delete('/:id', eliminarEvento );

module.exports = router;
