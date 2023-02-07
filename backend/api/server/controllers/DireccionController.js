import DireccionService from '../services/DireccionService';
import Util from "../utils/Utils";

const util = new Util();

class DireccionController {
    static async addDirecciones(req, res){
        let newDirs = req.body;
        const { proyectoId } = req.params;

        newDirs.dirs.forEach( dir => {
            dir.procesado = false
            dir.proyecto_id = proyectoId
        })
        try {
            const createdDir = await DireccionService.addDirecciones(newDirs.dirs)
            util.setSuccess(200, 'Direccion Guardada', createdDir)
            return util.send(res)
        }catch (e) {
            util.setError(400, e.message)
            return util.send(res)
        }
    }
}

export default DireccionController
