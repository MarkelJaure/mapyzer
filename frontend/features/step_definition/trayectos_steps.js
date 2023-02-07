const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const request = require('sync-request');
const jsondiff = require('json-diff');
const deleteKey = require ('key-del');

const url = 'http://localhost:3000';
let response

Given('que no existe el trayecto con codigo {string}', function (codigo) {
  try {
    let res = request("GET", `${url}/trayectos/codigo/${codigo}`);
    let body = JSON.parse(res.body.toString('utf-8'));
    if (body.statusCode == 501) {
      return true;
    } else {
      return assert.fail(body.statusCode);
    }
  } catch (error) {
    return assert.fail(error.message);
  }
});

  When('se solicita insertar el trayecto valido', function (docString) {
    let res;
    let trayecto = JSON.parse(docString)
    
  
    try {
      res = request('POST', `${url}/trayectos/1`, { json: trayecto});
      response = JSON.parse(res.getBody('utf8'));
       
      response = deleteKey(response, 'id');
      response = deleteKey(response, 'observaciones');
      response = deleteKey(response, 'validity');
      if (response.statusCode == 200) {
        return true;
  
      } else {
        return assert.fail(response.statusCode);
      }
  
    } catch (error) {
      return assert.fail(error.message);
    }
  });



  Then('se obtiene la respuesta {string}', function (respuestaEsperada) {
    let json = JSON.parse(respuestaEsperada)
    return assert.equal(undefined, jsondiff.diff(json, response))
  });



  Given('que existe el trayecto con codigo {string}', function (codigo) {
    try {
      let res = request("GET", `${url}/trayectos/codigo/${codigo}`);
      let body = JSON.parse(res.getBody('utf8'));
      if (body.statusCode == 200) {
        return true;
      } else {
        return assert.fail(body.statusCode);
      }
    } catch (error) {
      return assert.fail(error.message);
    }
  });

  When('se solicita insertar el trayecto con codigo repetido y que solapa el validity', function (docString) {
    let res;
    let trayecto = JSON.parse(docString)
  
    try {
      res = request('POST', `${url}/trayectos/1`, { json: trayecto});
      response = JSON.parse(res.body.toString('utf-8'));

      response = deleteKey(response, 'message');
      if (response.statusCode== 400) {
        return true;
  
      } else {
        return assert.fail(response.statusCode);
      }
  
    } catch (error) {
      return assert.fail(error.message);
    }
  });

  When('se solicita insertar el trayecto con menos de dos puntos de coordenadas', function (docString) {
    let res;
    let trayecto = JSON.parse(docString)
    
  
    try {
      res = request('POST', `${url}/trayectos/1`, { json: trayecto});
      response = JSON.parse(res.body.toString('utf-8'));
      if (response.statusCode== 502) {
        return true;
  
      } else {
        return assert.fail(response.statusCode);
      }
  
    } catch (error) {
      return assert.fail(error.message);
    }
  });

  When('se solicita insertar el trayecto con alguna coordenada de latitud invalida a la base de datos', function (docString) {
    let res;
    let trayecto = JSON.parse(docString)
    
  
    try {
      res = request('POST', `${url}/trayectos/1`, { json: trayecto});
      response = JSON.parse(res.body.toString('utf-8'));

      if (response.statusCode== 504) {
        return true;
  
      } else {
        return assert.fail(response.statusCode);
      }
  
    } catch (error) {
      return assert.fail(error.message);
    };
  });

  When('se solicita insertar el trayecto con alguna coordenada de longitud invalida a la base de datos', function (docString) {
    let res;
    let trayecto = JSON.parse(docString)
    
  
    try {
      res = request('POST', `${url}/trayectos/1`, { json: trayecto});
      response = JSON.parse(res.body.toString('utf-8'));

      if (response.statusCode== 504) {
        return true;
  
      } else {
        return assert.fail(response.statusCode);
      }
  
    } catch (error) {
      return assert.fail(error.message);
    };
  });

  When('se solicita insertar el trayecto con alguna coordenada no numerica', function (docString) {
    let res;
    let trayecto = JSON.parse(docString)
    
  
    try {
      res = request('POST', `${url}/trayectos/1`, { json: trayecto});
      response = JSON.parse(res.body.toString('utf-8'));

      if (response.statusCode== 504) {
        return true;
  
      } else {
        return assert.fail(response.statusCode);
      }
  
    } catch (error) {
      return assert.fail(error.message);
    };
  });

  When('se solicita insertar el trayecto con id_tipo_trayecto invalido', function (docString) {
    let res;
    let trayecto = JSON.parse(docString)
    
  
    try {
      res = request('POST', `${url}/trayectos/1`, { json: trayecto});
      response = JSON.parse(res.body.toString('utf-8'));
      response = deleteKey(response, 'message');

      if (response.statusCode== 400) {
        return true;
  
      } else {
        return assert.fail(response.statusCode);
      }
  
    } catch (error) {
      return assert.fail(error.message);
    };
  });

  When('se solicita insertar el trayecto con con menos de 2 coordenadas distintas', function (docString) {
    let res;
    let trayecto = JSON.parse(docString)
    
  
    try {
      res = request('POST', `${url}/trayectos/1`, { json: trayecto});
      response = JSON.parse(res.body.toString('utf-8'));

      if (response.statusCode== 503) {
        return true;
  
      } else {
        return assert.fail(response.statusCode);
      }
  
    } catch (error) {
      return assert.fail(error.message);
    };
  });

  When('se solicita insertar el trayecto con fecha invalida', function (docString) {
    let res;
    let trayecto = JSON.parse(docString)
    
  
    try {
      res = request('POST', `${url}/trayectos/1`, { json: trayecto});
      response = JSON.parse(res.body.toString('utf-8'));

      if (response.statusCode== 505) {
        return true;
  
      } else {
        return assert.fail(response.statusCode);
      }
  
    } catch (error) {
      return assert.fail(error.message);
    };
  });






