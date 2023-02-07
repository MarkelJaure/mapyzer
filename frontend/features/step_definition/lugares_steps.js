const assert = require('assert');
const { Given, When, Then } = require("cucumber");
const request = require('sync-request');
const jsondiff = require ('json-diff');
const deleteKey = require ('key-del');

const url = 'http://localhost:3000';

Given('el lugar a insertar con codigo {string} que no existe en la BD', function (codigo1) {
  let res;

  try {
    res = request("GET", `${url}/lugares/codigo/${codigo1}`);
    if (res.statusCode == 501) {
      return true;
    } else {
      return assert.fail(res.statusCode);
    }

  } catch (error) {
    return assert.fail(error.message);
  }

});
When('se solicita insertar el lugar', function (docString) {

  let res;
  lugar = JSON.parse(docString);

  try {
    res = request('POST', `${url}/lugares/1`, { json: lugar});
    response = JSON.parse(res.getBody('utf8'));

    if (response.statusCode == 200) {
      return true;

    } else {
      return assert.fail(response.StatusText);
    }

  } catch (error) {
    return assert.fail(error.message);
  }
});

Then('se obtiene la siguiente respuesta', function (docString) {
  let json = JSON.parse(docString)
  response = deleteKey(response, 'id');
  response = deleteKey(response, 'validity');
  response = deleteKey(response, 'localizacion');
  return assert.equal(undefined, jsondiff.diff(json, response))
});

When('se solicita insertar el lugar con coordenada incorrecta', function (docString) {
  let res;
  lugar = JSON.parse(docString);

  try {
    res = request('POST', `${url}/lugares/1`, { json: lugar });
    response2 = JSON.parse(res.body.toString('utf-8'));
    if (res.statusCode == 502) {
      return true;

    } else {
      return assert.fail(response2.StatusText);
    }

  } catch (error) {
    return assert.fail(error.message);
  }
});

Then('se obtiene la siguiente respuesta de error', function (docString) {
  let json = JSON.parse(docString)
  return assert.equal(undefined, jsondiff.diff(json, response2))
});

let id
Given('el lugar a insertar con codigo {string} que existe en la BD', function (codigo1) {
  let res;
  let respuesta

  try {
    res = request("GET", `${url}/lugares/codigo/${codigo1}`);
    respuesta = JSON.parse(res.getBody('utf8'));
    id = respuesta.data.id
    if (res.statusCode == 200) {
      return true;
    } else {
      return assert.fail(res.statusCode);
    }

  } catch (error) {
    return assert.fail(error.message);
  }
});

When('se solicita actualizar el lugar', function (docString) {
  let res;
  lugar = JSON.parse(docString);
  lugar["id"] = id;

  try {
    res = request('PUT', `${url}/lugares/update`, { json: lugar });
    response = JSON.parse(res.getBody('utf8'));
    response = deleteKey(response, 'id');

    if (response.statusCode == 200) {
      return true;

    } else {
      return assert.fail(response.StatusText);
    }

  } catch (error) {
    return assert.fail(error.message);
  }
})

Then('se obtiene la respuesta', function (docString) {
  let json = JSON.parse(docString)
  return assert.equal(undefined, jsondiff.diff(json, response))
});


When('se solicita insertar el lugar con coordenada que no es un numero', function (docString) {
  let res;
  lugar = JSON.parse(docString);

  try {
    res = request('POST', `${url}/lugares/1`, { json: lugar });
    response2 = JSON.parse(res.body.toString('utf-8'));
    if (res.statusCode == 503) {
      return true;

    } else {
      return assert.fail(response2.StatusText);
    }

  } catch (error) {
    return assert.fail(error.message);
  }
});



