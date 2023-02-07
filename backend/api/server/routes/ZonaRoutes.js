import { Router } from 'express'
import ZonaController from "../controllers/ZonaController"

const router = Router();


router.get('/', ZonaController.getZonasByPage)
router.put('/update', ZonaController.udpateZona)
router.get('/especificaciones', ZonaController.getAllZonas)
router.post('/:proyectoId', ZonaController.addZona)
router.get('/search/proyecto', ZonaController.getZonasByProyectoByPage)
router.get('/:id', ZonaController.getZona)
router.get('/codigo/:codigo', ZonaController.getZonaByCodigo)
router.get('/project/search', ZonaController.getByProyecto)

router.post('/copyData/:proyectoId', ZonaController.copyZonas)
router.post('/deleteData/:proyectoId', ZonaController.deleteZonas)

// TODO: Controllers
// router.put('/:id', ZonaController.updateZona)
// router.delete('/:id', ZonaController.deleteZona)

export default router;
