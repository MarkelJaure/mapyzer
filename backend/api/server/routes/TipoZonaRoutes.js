import { Router } from 'express'
import TipoZonaController from "../controllers/TipoZonaController"

const router = Router();

router.get('/especificaciones', TipoZonaController.getAllTipoZonas);
router.get('/search/:text', TipoZonaController.search);
router.get('/:id', TipoZonaController.getTipoZona);
router.get('/', TipoZonaController.getTipoZonaByPage)
router.post('/', TipoZonaController.addTipoZona)
router.put('/update', TipoZonaController.updateTipoZona)

export default router;
