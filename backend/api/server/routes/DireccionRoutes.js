import { Router } from 'express'
import DireccionController from "../controllers/DireccionController";

const router = Router();

router.post('/:proyectoId', DireccionController.addDirecciones)

export default router;
