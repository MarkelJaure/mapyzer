import database from "../src/models";
import Sequelize from "sequelize";
const Op = Sequelize.Op;
const nodemailer = require("nodemailer");

const getPagination = (page, size) => {
    const limit = size;
    const offset = (page - 1) * size;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: results } = data;
    const currentPage = page ? +page : 0;
    const last = Math.ceil(totalItems / limit);

    return { totalItems, results, last, currentPage };
};

class UsuarioService {
  static async getAllUsuarios() {
    try {
      return await database.usuarios.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async GetUsuariosByPage(page, size, rol) {
    try {
        const conditionRol = rol ? { rol: rol} : null;
        const { limit, offset } = getPagination(page, size);
        const resultado = await database.usuarios.findAndCountAll({
            where: { [Op.and]: [conditionRol] }, limit, offset,
            include: [
              { model: database.personas, as: 'persona',attributes: ['name','lastname']},
              ],
              attributes: ['id', 'username','email']
        }).then(data => {
            return getPagingData(data, page, limit)
        })
        return resultado
    } catch (error) {
        throw error
    }
}

  static async addUsuario(newUsuario) {
    newUsuario.email = newUsuario.email.toLowerCase()
    try {
      return await database.usuarios.create(newUsuario);
    } catch (error) {
      throw error;
    }
  }

  static async updateUsuario(id, updateUsuario) {
    try {
      const usuarioToUpdate = await database.usuarios.findOne({
        where: { id: Number(id) },
      });

      if (updateUsuario) {
        await database.usuarios.update(updateUsuario, {
          where: { id: Number(id) },
        });
        return updateUsuario;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async updateRol(id, rol) {
    try {
      const usuarioToUpdate = await database.usuarios.findOne({
        where: { id: Number(id) },
        include: [
          { model: database.personas, as: 'persona',},
          ],
      });
      if (usuarioToUpdate) {
        usuarioToUpdate.rol = rol
        await database.usuarios.update(usuarioToUpdate.dataValues, {
          where: { id: Number(id) },
        });
        return  usuarioToUpdate;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async getUsuario(id) {
    try {
      const theUsuario = await database.usuarios.findOne({
        where: { id: Number(id) },
        include: [
          { model: database.personas, as: 'persona',},
          ],
      });
      return theUsuario;
    } catch (error) {
      throw error;
    }
  }

  static async findUserByUsername(aUsername){
    try {
      const theUsuario = await database.usuarios.findOne({
        where: { username: aUsername },
        include: [
        { model: database.personas, as: 'persona',},
        ],
      });
      return theUsuario;
    } catch (error) {
      throw error;
    }
  }

  static async findUserByEmail(aEmail){
    try {
      const theUsuario = await database.usuarios.findOne({
        where: { email: aEmail },
        include: [
        { model: database.personas, as: 'persona',},
        ],
      });
      return theUsuario;
    } catch (error) {
      throw error;
    }
  }

  static async findUserByUsernameOrEmail(aUsernameOrEmail){
    try {
      const theUsuario = await database.usuarios.findOne({
        where: { [Op.or]: [{username:aUsernameOrEmail}, {email:aUsernameOrEmail.toLowerCase()}] },
        include: [
        { model: database.personas, as: 'persona',},
        ],
      });
      return theUsuario;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUsuario(id) {
    try {
      const usuarioToDelete = await database.usuarios.findOne({
        where: { id: Number(id) },
      });

      if (usuarioToDelete) {
        return await database.usuarios.destroy({
          where: { id: Number(id) },
        });
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static getMailForRegisterUser(email,name,username,password){
    return {      
      from: '"Mapyzer" <MapyzerUNPSJB@gmail.com>',
      to: email,
      subject: "Registro exitoso",
      html: "<h1>Hola " + name +"</h1>" +
      "<h3>Felicidades, su registro en MAPYZER fue exitoso. </h3>" +
      "<p>Datos de inicio de sesión:</p>" +
      "<p>Nombre de usuario: " + username +"</p>" +
      "<p>Contraseña: " + password +"</p>" +
      "<p>Recuerde que tambien puede iniciar sesion con su Email y cambiar la contraseña desde el sistema cuando usted lo desee.</p>" +
      "<p>Hasta que un administrador valide a su usuario, puede seguir visualizando los proyectos publicos de su interes.</p>", // html body
    }
  }

  static getMailFoValidationUser(email,name, username){
    return {      
      from: '"Mapyzer" <MapyzerUNPSJB@gmail.com>',
      to: email,
      subject: "Validacion en el sistema",
      html: "<h1>Hola " + name +"</h1>" +
      "<h3>Le informamos que un administrador del sistema valido a su usuario "+ username +"</h3>" +
      "<p>Ahora puede crear proyectos y generar sus mapas espacio-temporales.</p>" 
    }
  }

  static getMailForNewPassword(email,name, password){
    return {      
      from: '"Mapyzer" <MapyzerUNPSJB@gmail.com>',
      to: email,
      subject: "Recuperacion de la contraseña",
      html: "<h1>Hola " + name +"</h1>" +
      "<h3>Le informamos que hemos restaurado su contraseña para que pueda volver a ingresar al sistema </h3>" +
      "<p>Nueva contraseña: " + password +"</p>" +
      "<p>Recuerde que dentro del sistema puede volver a cambiar su contraseña entrando a 'Editar perfil', y luego a 'Editar Contraseña'.</p>"
    }
  }

  static async sendMail(mailOptions){
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: "MapyzerUNPSJB@gmail.com", 
        pass: "proy.mapyzer", 
      },
    });
    let mail = await transporter.sendMail(mailOptions)
  }

}

export default UsuarioService;
