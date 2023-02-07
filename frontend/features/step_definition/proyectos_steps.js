const assert = require('assert');
const { Given, When, Then, AfterAll } = require("cucumber");
const request = require('sync-request');
const jsondiff = require('json-diff');
const deleteKey = require('key-del');

const url = 'http://localhost:3000';
let responseGiven;
let responseWhen;


Given('que no existe el proyecto con nombre {string} de {string}', function (nombreProyecto, usernameUsuario) {
  try {
    responseGiven = request("GET", `${url}/proyectos/nombreAndUsuario/${nombreProyecto}/${usernameUsuario}`);
    if (responseGiven.statusCode == 404) {
      return true;
    } else {
      return assert.fail(responseGiven.statusCode);
    }

  } catch (error) {
    return assert.fail(error.message);
  }
});

Given('que existe el usuario con el username {string} y posee el proyecto el proyecto con nombre {string}', function (usernameUsuario, nombreProyecto ) {
  try {
    responseGiven = request("GET", `${url}/proyectos/nombreAndUsuario/${nombreProyecto}/${usernameUsuario}`);
    if (responseGiven.statusCode == 200) {
      return true;
    } else {
      return assert.fail(responseGiven.statusCode);
    }

  } catch (error) {
    return assert.fail(error.message);
  }
});

let response;
When('se solicita insertar el proyecto valido', function (docString) {
  var proyecto = JSON.parse(docString);
  try {
    let responseBackend = request('POST', `${url}/proyectos/`, { json: proyecto });
    responseWhen = JSON.parse(responseBackend.body.toString('utf-8'));

    if (responseWhen.statusCode == 200) {
      responseWhen = deleteKey(responseWhen, 'id');
      responseWhen = deleteKey(responseWhen, 'observaciones');
      responseWhen = deleteKey(responseWhen, 'timegen');
      responseWhen = deleteKey(responseWhen, 'isvalid');
      return true;

    } else {
      return assert.fail(responseWhen.StatusText);
    }

  } catch (error) {
    return assert.fail(error.message);
  }
});

When('se solicita insertar el proyecto con nombre repetido', function (docString) {
  var proyecto = JSON.parse(docString);
  try {
    let responseBackend = request('POST', `${url}/proyectos/`, { json: proyecto });
    responseWhen = JSON.parse(responseBackend.body.toString('utf-8'));

    if (responseWhen.statusCode == 400) {
      return true;
    } else {
      return assert.fail(responseWhen.StatusText);
    }

  } catch (error) {
    console.log(error)
    return assert.fail(error.message);
  }
});


When('se solicita actualizar el proyecto en la base de datos', function (docString) {
  var proyecto = JSON.parse(docString);
  proyecto.id = JSON.parse(responseGiven.body.toString('utf-8')).data.id;
  try {
    let responseBackend = request('PUT', `${url}/proyectos/update`, { json: proyecto });
    responseWhen = JSON.parse(responseBackend.body.toString('utf-8'));

    if (responseWhen.statusCode == 200) {
      responseWhen = deleteKey(responseWhen, 'id');
      responseWhen = deleteKey(responseWhen, 'observaciones');
      responseWhen = deleteKey(responseWhen, 'timegen');
      responseWhen = deleteKey(responseWhen, 'isvalid');
      return true;

    } else {
      console.log(response)
      return assert.fail(responseWhen.StatusText);
    }

  } catch (error) {
    return assert.fail(error.message);
  }
});

When('se solicita dar de baja el proyecto existente', function (docString) {
  var proyecto = JSON.parse(docString);
  if (JSON.parse(responseGiven.body.toString('utf-8')).data) {
    proyecto.id = JSON.parse(responseGiven.body.toString('utf-8')).data.id;
  }

  try {
    let responseBackend = request('DELETE', `${url}/proyectos/softDown?idProyecto=${proyecto.id}`);
    responseWhen = JSON.parse(responseBackend.body.toString('utf-8'));

    if (responseWhen.statusCode == 200) {
      responseWhen = deleteKey(responseWhen, 'id');
      responseWhen = deleteKey(responseWhen, 'observaciones');
      responseWhen = deleteKey(responseWhen, 'timegen');
      return true;

    } else {
      return assert.fail(responseWhen.StatusText);
    }

  } catch (error) {
    return assert.fail(error.message);
  }
});


When('se solicita dar de baja el proyecto inexistente', function (docString) {
  var proyecto = JSON.parse(docString);
  if (JSON.parse(responseGiven.body.toString('utf-8')).data) {
    proyecto.id = JSON.parse(responseGiven.body.toString('utf-8')).data.id;
  }

  try {
    let responseBackend = request('DELETE', `${url}/proyectos/softDown?idProyecto=${proyecto.id}`);
    responseWhen = JSON.parse(responseBackend.body.toString('utf-8'));

    if (responseWhen.statusCode == 400) {
      return true;

    } else {
      return assert.fail(responseWhen.StatusText);
    }

  } catch (error) {
    return assert.fail(error.message);
  }
});


Then('se obtiene la respuesta del proyecto {string}', function (respuestaEsperada) {

  let json = JSON.parse(respuestaEsperada)


  return assert.equal(undefined, jsondiff.diff(json, responseWhen))
});



AfterAll(function () {

  const nombreProyecto = "proyecto_testing"
  const username = "Markel"
  request('DELETE', `${url}/proyectos/hardDownByNombreAndUsername?proyecto=${nombreProyecto}&username=${username}`)
  
});



