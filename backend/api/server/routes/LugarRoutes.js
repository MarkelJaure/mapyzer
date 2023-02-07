import { Router } from 'express'
import LugarController from "../controllers/LugarController"

const router = Router();

router.get('', LugarController.getAllLugares)
router.get('/detalle', LugarController.getLugaresByPage)
router.get('/:id', LugarController.getLugar)
router.get('/codigo/:codigo', LugarController.getLugarByCode)
router.get('/search/proyecto', LugarController.getLugaresByProyectoByPage)
router.post('/:proyectoId', LugarController.addLugar)
router.put('/update', LugarController.updateLugar)
router.get('/per/per', LugarController.getPertenece)
router.get('/fecha/fecha', LugarController.getLugaresByDate)
router.get('/withDir/search', LugarController.getLugarWithDir)

router.post('/copyData/:proyectoId', LugarController.copyLugares)
router.post('/deleteData/:proyectoId', LugarController.deleteLugares)

export default router;
