import path from 'path'
const util = require("util");
const multer = require("multer");


let storage = multer.diskStorage({
    destination: path.resolve(__dirname, '..', 'files'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const name = path.basename(file.originalname, ext)
        cb(null, `${req.header('numEsquema')}-${req.header('proyectoId')}-${name.replace(/\s/g, '')}-${Date.now()}${ext}`)
    }
});

let uploadFile = multer({
    storage: storage,
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;
