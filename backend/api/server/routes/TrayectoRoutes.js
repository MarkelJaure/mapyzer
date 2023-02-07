import { Router } from 'express'
import TrayectoController from "../controllers/TrayectoController"

const router = Router();


router.get('/', TrayectoController.getTrayectosByPage)
router.put('/update', TrayectoController.udpateTrayecto)
router.get('/especificaciones', TrayectoController.getAllTrayectos)
router.post('/:proyectoId', TrayectoController.addTrayecto)
router.get('/search/proyecto', TrayectoController.getTrayectosByProyectoByPage)
router.get('/:id', TrayectoController.getTrayecto)
router.get('/codigo/:codigo', TrayectoController.getTrayectoByCodigo)
router.get('/project/search', TrayectoController.getByProyecto)
router.post('/copyData/:proyectoId', TrayectoController.copyTrayectos)
router.post('/deleteData/:proyectoId', TrayectoController.deleteTrayectos)

// TODO: Controllers
// router.put('/:id', TrayectoController.updateTrayecto)
// router.delete('/:id', TrayectoController.deleteTrayecto)

export default router;
