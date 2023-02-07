import { Router } from 'express'
import TipoLugarController from "../controllers/TipoLugarController"

const router = Router();

router.get('/especificaciones', TipoLugarController.getAllTipoLugares);
router.get('/search/:text', TipoLugarController.search);
router.get('/:id', TipoLugarController.getTipoLugar);
router.get('/', TipoLugarController.getTipoLugarByPage)
router.post('/', TipoLugarController.addTipoLugar)
router.put('/update', TipoLugarController.updateTipoLugar)

export default router;
