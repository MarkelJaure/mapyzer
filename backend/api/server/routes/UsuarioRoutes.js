import { Router } from 'express'
import UsuarioController from "../controllers/UsuarioController"

const router = Router();

router.get('/', UsuarioController.getAllUsuarios)
router.get('/detalle', UsuarioController.getUsuariosByPage)
router.get('/username', UsuarioController.findUserByUsername)
router.get('/email', UsuarioController.findUserByEmail)
router.get('/usernameOrEmail', UsuarioController.findUserByUsernameOrEmail)
router.post('/', UsuarioController.addUsuario)
router.get('/:id', UsuarioController.getUsuario)
router.post('/authenticate', UsuarioController.authenticateUser)
router.post('/register', UsuarioController.registerUser)
router.post('/forgot-password', UsuarioController.forgotPasswordUser)
router.put('/update', UsuarioController.updateUser)
router.put('/updateRol', UsuarioController.updateRol)
router.put('/updatePassword', UsuarioController.updatePasswordUser)

//TODO: Controllers
// router.get('/:id', UsuarioController.getAUsuario)
// router.put('/:id', UsuarioController.updateUsuario)
// router.delete('/:id', UsuarioController.deleteUsuario)

export default router;
