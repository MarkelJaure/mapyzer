import { Router } from 'express'
import TipoTrayectoController from "../controllers/TipoTrayectoController"

const router = Router();

router.get('/especificaciones', TipoTrayectoController.getAllTipoTrayectos);
router.get('/search/:text', TipoTrayectoController.search);
router.get('/:id', TipoTrayectoController.getTipoTrayecto);
router.post('/', TipoTrayectoController.addTipoTrayecto)
router.get('/', TipoTrayectoController.getTipoTrayectoByPage)
router.put('/update', TipoTrayectoController.updateTipoTrayecto)

export default router;
