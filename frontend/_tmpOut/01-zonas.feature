# language: es

Característica: Insertar Zonas a la base de datos, verificando que todas las condiciones se cumplan

Escenario: Insertar una zona valida a la base de datos

    Dado que no existe la zona con codigo "1234"

    Cuando se solicita insertar la zona valida
    """
    {
        "zona": "Zona valida",
        "id_tipo_zona": 1,
        "poligono": {"crs":{"type":"name","properties":{"name":"EPSG:4326"}},"type":"Polygon","coordinates":[
         [
            [-42.779552, -65.034510],
            [-42.776938, -65.026571],
            [-42.782545, -65.023009],
            [-42.785064, -65.030948],
            [-42.779552, -65.034510]
         ]
         ]
         },
        "codigo": "1234",
        "id_tipo_zona":1,
        "validity": [{ "value": null, "inclusive": false },{ "value": null, "inclusive": false }],
        "descripcion": "La zona que pudo ser insertada desde el feature"
    }
    """
    Entonces se obtiene la siguiente respuesta '{ "statusCode": 200,"status": "success","message": "Zona agregada","data": {"zona": "Zona valida", "id_tipo_zona": 1, "poligono": {"crs":{"type":"name","properties":{"name":"EPSG:4326"}},"type":"Polygon","coordinates":[[[-42.779552, -65.034510],[-42.776938, -65.026571],[-42.782545, -65.023009],[-42.785064, -65.030948],[-42.779552, -65.034510]]]},"codigo": "1234","descripcion": "La zona que pudo ser insertada desde el feature"}}'

Escenario: Insertar una zona con codigo repetido y que solapa el validity a la base de datos

    Dado que existe la zona con codigo "1234"

    Cuando se solicita insertar la zona con codigo repetido y que solapa el validity
    """
    {
        "zona": "Zona no valida",
        "id_tipo_zona": 1,
        "poligono": {"crs":{"type":"name","properties":{"name":"EPSG:4326"}},"type":"Polygon","coordinates":[
         [
            [-42.779552, -65.034510],
            [-42.776938, -65.026571],
            [-42.782545, -65.023009],
            [-42.785064, -65.030948],
            [-42.779552, -65.034510]
         ]
         ]
         },
        "codigo": "1234",
        "id_tipo_zona":1,
        "validity": [{ "value": null, "inclusive": false },{ "value": null, "inclusive": false }],
        "descripcion": "Zona con codigo repetido y que solapa el validity"
    }
    """
    Entonces se obtiene la siguiente respuesta '{ "statusCode": 400, "status": "error" }'


Escenario: Insertar una zona con menos de 4 puntos de coordenadas a la base de datos

    Dado que no existe la zona con codigo "1235"

    Cuando se solicita insertar la zona con menos de cuatro puntos de coordenadas
    """
    {
        "zona": "Zona no valida",
        "id_tipo_zona": 1,
        "poligono": {"crs":{"type":"name","properties":{"name":"EPSG:4326"}},"type":"Polygon","coordinates":[
         [
            [-42.779552, -65.034510],
            [-42.776938, -65.026571],
            [-42.776938, -65.026571]
         ]
         ]
         },
        "codigo": "1235",
        "id_tipo_zona":1,
        "validity": [{ "value": null, "inclusive": false },{ "value": null, "inclusive": false }],
        "descripcion": "La zona que posee menos de 4 puntos de coordenadas"
    }
    """
    Entonces se obtiene la siguiente respuesta '{ "statusCode": 502, "status": "error", "message": "Insertar mínimo 4 coordenadas" }'

Escenario: Insertar una zona con puntos de coordenadas inicial y final distintos a la base de datos

    Dado que no existe la zona con codigo "1236"

    Cuando se solicita insertar la zona con puntos de coordenadas inicial y final distintos a la base de datos
    """
    {
        "zona": "Zona no valida",
        "id_tipo_zona": 1,
        "poligono": {"crs":{"type":"name","properties":{"name":"EPSG:4326"}},"type":"Polygon","coordinates":[
         [
            [-42.779552, -65.034510],
            [-42.776938, -65.026571],
            [-42.782545, -65.023009],
            [-42.785064, -65.030948],
            [-24.779552, -95.034510]
         ]
         ]
         },
        "codigo": "1236",
        "id_tipo_zona":1,
        "validity": [{ "value": null, "inclusive": false },{ "value": null, "inclusive": false }],
        "descripcion": "La zona con puntos de coordenadas inicial y final distintos"
    }
    """
    Entonces se obtiene la siguiente respuesta '{ "statusCode": 503, "status": "error", "message": "La primera coordenada debe ser igual a la última" }'

Escenario: Insertar una zona con alguna coordenada de latitud invalida a la base de datos

    Dado que no existe la zona con codigo "1237"

    Cuando se solicita insertar la zona con alguna coordenada de latitud invalida a la base de datos
    """
    {
        "zona": "Zona no valida",
        "id_tipo_zona": 1,
        "poligono": {"crs":{"type":"name","properties":{"name":"EPSG:4326"}},"type":"Polygon","coordinates":[
         [
            [-42.779552, -65.034510],
            [-42.776938, -65.026571],
            [-1042.782545, -65.023009],
            [-42.785064, -65.030948],
            [-42.779552, -65.034510]
         ]
         ]
         },
        "codigo": "1237",
        "id_tipo_zona":1,
        "validity": [{ "value": null, "inclusive": false },{ "value": null, "inclusive": false }],
        "descripcion": "La zona con alguna coordenada de latitud invalida"
    }
    """
    Entonces se obtiene la siguiente respuesta '{ "statusCode": 504, "status": "error", "message": "Todas las latitudes deben ser números entre-90 y 90" }'

Escenario: Insertar una zona con alguna coordenada de longitud invalida a la base de datos

    Dado que no existe la zona con codigo "1237"

    Cuando se solicita insertar la zona con alguna coordenada de longitud invalida a la base de datos
    """
    {
        "zona": "Zona no valida",
        "id_tipo_zona": 1,
        "poligono": {"crs":{"type":"name","properties":{"name":"EPSG:4326"}},"type":"Polygon","coordinates":[
         [
            [-42.779552, -65.034510],
            [-42.776938, -65.026571],
            [-42.782545, -1065.023009],
            [-42.785064, -65.030948],
            [-42.779552, -65.034510]
         ]
         ]
         },
        "codigo": "1237",
        "id_tipo_zona":1,
        "validity": [{ "value": null, "inclusive": false },{ "value": null, "inclusive": false }],
        "descripcion": "La zona con alguna coordenada de longitud invalida"
    }
    """
    Entonces se obtiene la siguiente respuesta '{ "statusCode": 504, "status": "error", "message": "Todas las longitudes deben ser números entre -180 y 180" }'

Escenario: Insertar una zona con alguna coordenada no numerica

    Dado que no existe la zona con codigo "1238"

    Cuando se solicita insertar la zona con alguna coordenada no numerica
    """
    {
        "zona": "Zona no valida",
        "id_tipo_zona": 1,
        "poligono": {"crs":{"type":"name","properties":{"name":"EPSG:4326"}},"type":"Polygon","coordinates":[
         [
            [-42.779552, -65.034510],
            ["a", -65.026571],
            [-42.782545, -1065.023009],
            [-42.785064, -65.030948],
            [-42.779552, -65.034510]
         ]
         ]
         },
        "codigo": "1238",
        "id_tipo_zona":1,
        "validity": [{ "value": null, "inclusive": false },{ "value": null, "inclusive": false }],
        "descripcion": "La zona con alguna coordenada no numerica"
    }
    """
    Entonces se obtiene la siguiente respuesta '{ "statusCode": 504, "status": "error", "message": "Todas las coordenadas deben ser números" }'

Escenario: Insertar una zona con tipo_zona invalido

    Dado que no existe la zona con codigo "1239"

    Cuando se solicita insertar la zona con id_tipo_zona invalido
    """
    {
        "zona": "Zona no valida",
        "id_tipo_zona": 5,
        "poligono": {"crs":{"type":"name","properties":{"name":"EPSG:4326"}},"type":"Polygon","coordinates":[
         [
            [-42.779552, -65.034510],
            [-42.776938, -65.026571],
            [-42.782545, -65.023009],
            [-42.785064, -65.030948],
            [-42.779552, -65.034510]
         ]
         ]
         },
        "codigo": "1239",
        "validity": [{ "value": null, "inclusive": false },{ "value": null, "inclusive": false }],
        "descripcion": "La zona con id tipo zona invalido (no existe tipo_zona con el id_tipo_zona)"
    }
    """
    Entonces se obtiene la siguiente respuesta '{ "statusCode": 400, "status": "error" }'

Escenario: Insertar una zona con menos de 3 coordenadas distintas

    Dado que no existe la zona con codigo "1240"

    Cuando se solicita insertar la zona con con menos de 3 coordenadas distintas
    """
    {
        "zona": "Zona no valida",
        "id_tipo_zona": 1,
        "poligono": {"crs":{"type":"name","properties":{"name":"EPSG:4326"}},"type":"Polygon","coordinates":[
         [
            [-42, -65],
            [-42, -65],
            [-43, -66],
            [-42, -65]
         ]
         ]
         },
        "codigo": "1240",
        "validity": [{ "value": null, "inclusive": false },{ "value": null, "inclusive": false }],
        "descripcion": "La zona con menos de 3 coordenadas distintas"
    }
    """
    Entonces se obtiene la siguiente respuesta '{ "statusCode": 503, "status": "error", "message": "Insertar al menos 3 coordenadas distintas" }'

Escenario: Insertar una zona con fecha invalida

    Dado que no existe la zona con codigo "1241"

    Cuando se solicita insertar la zona con fecha invalida
    """
    {
        "zona": "Zona no valida",
        "id_tipo_zona": 1,
        "poligono": {"crs":{"type":"name","properties":{"name":"EPSG:4326"}},"type":"Polygon","coordinates":[
         [
            [-42.779552, -65.034510],
            [-42.776938, -65.026571],
            [-42.782545, -65.023009],
            [-42.785064, -65.030948],
            [-42.779552, -65.034510]
         ]
         ]
         },
        "codigo": "1241",
        "descripcion": "La zona con fecha invalida",
        "validity": [{"value":"2040-01-01T16:40:00.000Z","inclusive":true},{"value":"2020-10-19T16:40:00.000Z","inclusive":true}]
    }
    """
    Entonces se obtiene la siguiente respuesta '{ "statusCode": 505, "status": "error", "message": "Fecha Desde debe ser menor o igual que Fecha Hasta" }'


