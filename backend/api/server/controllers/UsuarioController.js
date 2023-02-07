import PersonaService from "../services/PersonaService";
import UsuarioService from "../services/UsuarioService";
import Util from "../utils/Utils";
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const deleteKey = require('key-del');
const nodemailer = require("nodemailer");

const util = new Util();

var createdUsuario = null;
var createdPersona = null;
let testAccount;





class UsuarioController {
  static async getAllUsuarios(req, res) {
    try {
      const allUsuarios = await UsuarioService.getAllUsuarios();
      if (allUsuarios.length > 0) {
        util.setSuccess(200, "Usuarios encontrados", allUsuarios);
      } else {
        util.setSuccess(200, "No se encontró ningún usuario");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getUsuario(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Por favor ingrese un valor numérico');
      return util.send(res);
    }

    try {
      const theUsuario = await UsuarioService.getUsuario(id);
      if (!theUsuario) {
        util.setError(404, `No se puede encontrar un Usuario con id ${id}`);
      } else {
        util.setSuccess(200, 'Usuario encontrado', theUsuario);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async getUsuariosByPage(req, res) {
    try {
      const { page, size, rol } = req.query;
      const usuariosPaginados = await UsuarioService.GetUsuariosByPage(page, size, rol);
      util.setSuccess(200, 'Usuarios Paginados', usuariosPaginados);
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  };

  static async addUsuario(req, res) {
    if (!req.body.username || !req.body.password || !req.body.rol) {
      util.setError(400, "Por favor introduzca todos los detalles");
      return util.send(res);
    }
    const newUsuario = req.body;

    try {
      const createdUsuario = await UsuarioService.addUsuario(newUsuario);
      util.setSuccess(200, "Usuario agregado", createdUsuario);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async findUserByUsername(req, res) {
    const { username } = req.body;

    try {
      var theUser = await UsuarioService.findUserByUsername(username);
      if (!theUser) {
        util.setError(501, `No se puede encontrar un usuario con username ${username}`);
      } else {
        theUser.password = null;
        util.setSuccess(200, "Usuario encontrado", theUser);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async findUserByEmail(req, res) {
    const { email } = req.body;

    try {
      var theUser = await UsuarioService.findUserByEmail(email);
      if (!theUser) {
        util.setError(501, `No se puede encontrar un usuario con email ${email}`);
      } else {
        theUser.password = null;
        util.setSuccess(200, "Usuario encontrado", theUser);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async findUserByUsernameOrEmail(req, res) {
    const { username } = req.body;

    try {
      var theUser = await UsuarioService.findUserByUsernameOrEmail(username);
      if (!theUser) {
        util.setError(501, `No se puede encontrar un usuario con username o email: ${username}`);
      } else {
        theUser.password = null;
        util.setSuccess(200, "Usuario encontrado", theUser);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async authenticateUser(req, res) {
    const { username, password } = req.body;

    try {
      var theUser = await UsuarioService.findUserByUsernameOrEmail(username);
      const resultUserAndPassword = theUser ? bcrypt.compareSync(password, theUser.password) : false;

      if (resultUserAndPassword) { //SI existe el usuario y es correcta la password

        theUser.token = jwt.sign({ id: theUser.id, rol: theUser.rol }, 'shhhhh'); // Generacion del token
        theUser = await UsuarioService.updateUsuario(theUser.id, theUser.dataValues); //Guardado del nuevo token en BD

        theUser.password = null; //Se elimina la password antes de devolver el usuario

        util.setSuccess(200, "Inicio de sesion exitoso", theUser);
      } else {
        util.setError(501, `Usuario/Email o Contraseña incorrectos`); // Cambiar a Datos incorrectos
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async updateRol(req, res) {
    const { id, rol } = req.body;

    if (!Number(id)) {
      util.setError(400, "Por favor ingrese un valor numérico");
      return util.send(res);
    }

    try {
      const updatedUsuario = await UsuarioService.updateRol(id, rol);

      if (rol == "usuario")
        UsuarioService.sendMail(UsuarioService.getMailFoValidationUser(updatedUsuario.dataValues.email, updatedUsuario.dataValues.persona.name, updatedUsuario.dataValues.username)) //Mail al nuevo usuario        

      updatedUsuario.password = null
      util.setSuccess(200, "Usuario actualizado", updatedUsuario);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async updateUser(req, res) {
    const newUsuario = req.body;
    const newPersona = newUsuario.persona;
    var theUser = await UsuarioService.getUsuario(newUsuario.id)
    var thePersona = theUser.persona
    try {

      if (theUser) {
        const resultPassword = bcrypt.compareSync(newUsuario.password, theUser.password);
        if (resultPassword) {
          newUsuario.password = theUser.password;
          newUsuario.rol = theUser.rol
          newUsuario.token = theUser.token

          theUser = await UsuarioService.updateUsuario(newUsuario.id, newUsuario)
          thePersona = await PersonaService.updatePersona(newPersona.id, newPersona)
          newUsuario.password = null;
          util.setSuccess(200, 'Usuario Updated', newUsuario)
        } else {
          util.setError(401, 'Contraseña incorrecta')
        }
      } else {
        util.setError(401, 'Usuario no encontrado')
      }

      return util.send(res)

    } catch (error) {
      switch (error.original.constraint) {
        case 'usuarios_username_key': error.message = "Ya existe un usuario con ese Username"; break;
        case 'personas_dni_key': error.message = "Ya existe un usuario con ese DNI"; break;
        case 'usuarios_email_key': error.message = "Ya existe un usuario con ese Email"; break;
        default: error.message = "Error inseperado:" + error.original.constraint
      }
      util.setError(400, error.message)
      return util.send(res)
    }
  }

  static async updatePasswordUser(req, res) {
    const newUsuario = req.body.usuario;
    const password = req.body.password
    const newPassword = req.body.newPassword
    var theUser = await UsuarioService.getUsuario(newUsuario.id)
    try {

      if (theUser) {
        const resultPassword = bcrypt.compareSync(password, theUser.password);
        if (resultPassword) {
          newUsuario.rol = theUser.rol
          theUser.password = bcrypt.hashSync(newPassword, 8);
          theUser = await UsuarioService.updateUsuario(theUser.id, theUser.dataValues)
          newUsuario.password = null;
          util.setSuccess(200, 'Usuario Updated', newUsuario)
        } else {
          util.setError(401, 'Contraseña incorrecta')
        }
      } else {
        util.setError(401, 'Usuario no encontrado')
      }

      return util.send(res)

    } catch (error) {
      util.setError(400, error.message)
      return util.send(res)
    }
  }


  static async registerUser(req, res) {
    const newUsuario = req.body;
    var password = newUsuario.password
    newUsuario.password = bcrypt.hashSync(newUsuario.password, 8);
    const newPersona = newUsuario.persona;
    try {
      createdUsuario = await UsuarioService.addUsuario(newUsuario);
      newPersona.id = createdUsuario.id
      createdPersona = await PersonaService.addPersona(newPersona)
      newUsuario.id_persona = createdPersona.id
      createdUsuario.id_persona = createdPersona.id
      createdUsuario = await UsuarioService.updateUsuario(createdUsuario.id, createdUsuario.dataValues)

      UsuarioService.sendMail(UsuarioService.getMailForRegisterUser(newUsuario.email, newPersona.name, newUsuario.username, password)) //Mail al nuevo usuario

      createdUsuario.password = null;
      util.setSuccess(200, "Usuario agregado correctamente", createdUsuario);
      return util.send(res);
    } catch (error) {
      switch (error.original.constraint) {
        case 'usuarios_username_key': error.message = "Ya existe un usuario con ese Username"; break;
        case 'personas_dni_key': error.message = "Ya existe un usuario con ese DNI"; break;
        case 'usuarios_email_key': error.message = "Ya existe un usuario con ese Email"; break;
        default: error.message = "Error inseperado:" + error.original.constraint
      }
      if (createdUsuario) {
        await UsuarioService.deleteUsuario(createdUsuario.id);
        createdUsuario = null
      }
      if (createdPersona) {
        await PersonaService.deletePersona(createdPersona.id);
        createdPersona = null;
      }
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async forgotPasswordUser(req, res) {
    const { email, dni } = req.body

    try {
      var theUser = await UsuarioService.findUserByEmail(email);
      if (theUser && theUser.persona.dni == dni) {

       
        var newPassword = UsuarioController.generateNewPassword(6)

        UsuarioService.sendMail(UsuarioService.getMailForNewPassword(theUser.email,theUser.persona.name,newPassword)) //Mail al usuario

        theUser.password =  bcrypt.hashSync(newPassword, 8);
        theUser = await UsuarioService.updateUsuario(theUser.id, theUser.dataValues)
        
        theUser.password = null;
        util.setSuccess(200, "Usuario encontrado", theUser);
      } else {

        util.setError(501, `Datos incorrectos`);

      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message)
      return util.send(res)
    }

  }

  static generateNewPassword(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

}

export default UsuarioController;
