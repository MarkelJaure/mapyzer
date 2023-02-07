import { Router } from 'express'
import PersonaController from "../controllers/PersonaController"

const router = Router();

router.get('/', PersonaController.getAllPersonas)
router.get('/:dni', PersonaController.findPersonaByDNI)
router.post('/', PersonaController.addPersona)

//TODO: Controllers
// router.get('/:id', PersonaController.getAPersona)
// router.put('/:id', PersonaController.updatePersona)
// router.delete('/:id', PersonaController.deletePersona)

export default router;
