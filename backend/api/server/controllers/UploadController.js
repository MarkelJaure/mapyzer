import Util from "../utils/Utils";
import uploadFile from '../services/UploadService'

const util = new Util()

class UploadController {
    static async uploadCsvEsqUno(req, res) {
        try {
            await uploadFile(req, res);

            if (req.file === undefined) {
                util.setError(400, 'Por favor carga un archivo!')
                return util.send(res)
            }
            util.setSuccess(200, `El archivo ${req.file.originalname} se subió correctamente`)
            return util.send(res)
        } catch (e) {
            util.setError(500,
            `No se pudo subir el archivo: ${req.file.originalname}. ${e}`)
        }
    }
}
export default UploadController
