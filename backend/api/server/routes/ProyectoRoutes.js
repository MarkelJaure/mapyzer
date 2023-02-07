import { Router } from 'express'
import ProyectoController from "../controllers/ProyectoController"

const router = Router();

//GET
router.get('/byPage', ProyectoController.getProyectosByPage)
router.get('/especificaciones', ProyectoController.getAllProyectos)

router.get('/:id', ProyectoController.getProyecto)
router.get('/nombre/:nombre', ProyectoController.getProyectoByNombre)
router.get('/especificaciones/:id', ProyectoController.getProyectoAndEspecificaciones)


router.get('/byPageAndUser/:idUsuario', ProyectoController.getProyectosByUserByPage)
router.get('/byUser/:idUsuario', ProyectoController.getProyectosByUser)

router.get('/nombreAndUsuario/:nombre/:username', ProyectoController.getProyectoByNombreAndUsername)


//POST
router.post('/', ProyectoController.addProyecto)
router.post('/especificacionesByIDs', ProyectoController.getAllProyectosByIDs)

//PUT
router.put('/update', ProyectoController.updateProyecto)

//DELETE
router.delete('/softDown', ProyectoController.deleteProyectoSoft)
router.delete('/hardDownByNombreAndUsername', ProyectoController.deleteProyectoHardByNombreAndUsername)

router.delete('/lugares/', ProyectoController.deleteLugarProyecto)
router.delete('/zonas/', ProyectoController.deleteZonaProyecto)
router.delete('/trayectos/', ProyectoController.deleteTrayectoProyecto)

export default router;
