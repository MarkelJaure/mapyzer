import express from 'express';

import LugarRoutes from './routes/LugarRoutes'
import ProyectoRoutes from './routes/ProyectoRoutes'
import TipoLugarRoutes from './routes/TipoLugarRoutes'
import tipoZonaRoutes from './routes/TipoZonaRoutes'
import tipoTrayectoRoutes from './routes/TipoTrayectoRoutes'
import UsuarioRoutes from './routes/UsuarioRoutes'
import PersonaRoutes from './routes/PersonaRoutes'
import ZonaRoutes from './routes/ZonaRoutes'
import trayectoRoutes from './routes/TrayectoRoutes'
import UploadRoutes from './routes/UploadRoutes'
import DireccionesRoutes from './routes/DireccionRoutes'

const routes = express.Router()
// const upload = multer()

routes.get('/', (req, res) => res.status(200).send({
    status: 200
}));

// Usuarios
routes.use('/users', UsuarioRoutes)
//Personas
routes.use('/personas', PersonaRoutes)
// Zonas
routes.use('/zonas', ZonaRoutes)
routes.use('/tiposZonas', tipoZonaRoutes)
// Lugares
routes.use('/lugares', LugarRoutes)
routes.use('/tiposLugares', TipoLugarRoutes)
//Trayectos
routes.use('/trayectos', trayectoRoutes)
routes.use('/tiposTrayectos', tipoTrayectoRoutes)
// Proyectos
routes.use('/proyectos', ProyectoRoutes)
// Upload
routes.use('/upload', UploadRoutes)
// Direcciones
routes.use('/dirs', DireccionesRoutes)

module.exports = routes
