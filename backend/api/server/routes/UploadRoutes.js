import { Router } from 'express'
import UploadController from "../controllers/UploadController";

const router = Router();

router.post('/esquemaCsvUno', UploadController.uploadCsvEsqUno)

export default router
