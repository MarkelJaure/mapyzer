            # language: es

            Característica: Insertar Trayectos a la base de datos, verificando que todas las condiciones se cumplan

            Escenario: Insertar un trayecto valido a la base de datos

            Dado que no existe el trayecto con codigo "1234"

            Cuando se solicita insertar el trayecto valido
            """
            {
                "trayecto": "Trayecto valido",
                "id_tipo_trayecto": 1,
                "curva": {
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
                    "type": "LineString",
                    "coordinates": [
                        [
                            -42.782353,
                            -65.056268
                        ],
                        [
                            -42.774423,
                            -65.032927
                        ],
                        [
                            -42.778118,
                            -65.03058
                        ]
                    ]
                },
                "codigo": "1234",
                "validity": [
                    {
                        "value": null,
                        "inclusive": false
                    },
                    {
                        "value": null,
                        "inclusive": false
                    }
                ],
                "descripcion": "el trayecto que pudo ser insertado desde el feature"
            }
            """
            Entonces se obtiene la respuesta '{ "statusCode": 200,"status": "success","message": "Trayecto agregado","data": {"trayecto": "Trayecto valido", "id_tipo_trayecto": 1, "curva": {"crs":{"type":"name","properties":{"name":"EPSG:4326"}},"type":"LineString","coordinates":[[-42.782353, -65.056268], [-42.774423, -65.032927], [-42.778118, -65.030580]]},"codigo": "1234","descripcion": "el trayecto que pudo ser insertado desde el feature"}}'

            Escenario: Insertar un trayecto con codigo repetido y que solapa el validity a la base de datos

            Dado que existe el trayecto con codigo "1234"

            Cuando se solicita insertar el trayecto con codigo repetido y que solapa el validity
            """
            {
                "trayecto": "Trayecto no valido",
                "id_tipo_trayecto": 1,
                "curva": {
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
                    "type": "LineString",
                    "coordinates": [
                        [
                            -42.782353,
                            -65.056268
                        ],
                        [
                            -42.774423,
                            -65.032927
                        ],
                        [
                            -42.778118,
                            -65.03058
                        ]
                    ]
                },
                "codigo": "1234",
                "validity": [
                    {
                        "value": null,
                        "inclusive": false
                    },
                    {
                        "value": null,
                        "inclusive": false
                    }
                ],
                "descripcion": "Trayecto con codigo repetido y que solapa el validity"
            }
            """
            Entonces se obtiene la respuesta '{ "statusCode": 400, "status": "error" }'


            Escenario: Insertar un trayecto con menos de 2 puntos de coordenadas a la base de datos

            Dado que no existe el trayecto con codigo "1235"

            Cuando se solicita insertar el trayecto con menos de dos puntos de coordenadas
            """
            {
                "trayecto": "Trayecto no valido",
                "id_tipo_trayecto": 1,
                "curva": {
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
                    "type": "LineString",
                    "coordinates": [
                        [
                            -42.782353,
                            -65.056268
                        ]
                    ]
                },
                "codigo": "1235",
                "validity": [
                    {
                        "value": null,
                        "inclusive": false
                    },
                    {
                        "value": null,
                        "inclusive": false
                    }
                ],
                "descripcion": "el trayecto que posee menos de 2 puntos de coordenadas"
            }
            """
            Entonces se obtiene la respuesta '{ "statusCode": 502, "status": "error", "message": "Insertar mínimo 2 coordenadas" }'

            Escenario: Insertar un trayecto con alguna coordenada de latitud invalida a la base de datos

            Dado que no existe el trayecto con codigo "1237"

            Cuando se solicita insertar el trayecto con alguna coordenada de latitud invalida a la base de datos
            """
            {
                "trayecto": "Trayecto no valido",
                "id_tipo_trayecto": 1,
                "curva": {
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
                    "type": "LineString",
                    "coordinates": [
                        [
                            -42.782353,
                            -65.056268
                        ],
                        [
                            800,
                            -65.032927
                        ],
                        [
                            -42.778118,
                            -65.03058
                        ]
                    ]
                },
                "codigo": "1237",
                "validity": [
                    {
                        "value": null,
                        "inclusive": false
                    },
                    {
                        "value": null,
                        "inclusive": false
                    }
                ],
                "descripcion": "el trayecto con alguna coordenada de latitud invalida"
            }
            """
            Entonces se obtiene la respuesta '{ "statusCode": 504, "status": "error", "message": "Todas las latitudes deben ser números entre-90 y 90" }'

            Escenario: Insertar un trayecto con alguna coordenada de longitud invalida a la base de datos

            Dado que no existe el trayecto con codigo "1237"

            Cuando se solicita insertar el trayecto con alguna coordenada de longitud invalida a la base de datos
            """
            {
                "trayecto": "Trayecto no valido",
                "id_tipo_trayecto": 1,
                "curva": {
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
                    "type": "LineString",
                    "coordinates": [
                        [
                            -42.782353,
                            -65.056268
                        ],
                        [
                            -42.774423,
                            2567
                        ],
                        [
                            -42.778118,
                            -65.03058
                        ]
                    ]
                },
                "codigo": "1237",
                "validity": [
                    {
                        "value": null,
                        "inclusive": false
                    },
                    {
                        "value": null,
                        "inclusive": false
                    }
                ],
                "descripcion": "el trayecto con alguna coordenada de longitud invalida"
            }
            """
            Entonces se obtiene la respuesta '{ "statusCode": 504, "status": "error", "message": "Todas las longitudes deben ser números entre -180 y 180" }'

            Escenario: Insertar un trayecto con alguna coordenada no numerica

            Dado que no existe el trayecto con codigo "1238"

            Cuando se solicita insertar el trayecto con alguna coordenada no numerica
            """
            {
                "trayecto": "Trayecto no valido",
                "id_tipo_trayecto": 1,
                "curva": {
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
                    "type": "LineString",
                    "coordinates": [
                        [
                            -42.782353,
                            -65.056268
                        ],
                        [
                            "a",
                            -65.032927
                        ],
                        [
                            -42.778118,
                            -65.03058
                        ]
                    ]
                },
                "codigo": "1238",
                "validity": [
                    {
                        "value": null,
                        "inclusive": false
                    },
                    {
                        "value": null,
                        "inclusive": false
                    }
                ],
                "descripcion": "el trayecto con alguna coordenada no numerica"
            }
            """
            Entonces se obtiene la respuesta '{ "statusCode": 504, "status": "error", "message": "Todas las coordenadas deben ser números" }'

            Escenario: Insertar un trayecto con tipo_trayecto invalido

            Dado que no existe el trayecto con codigo "1239"

            Cuando se solicita insertar el trayecto con id_tipo_trayecto invalido
            """
            {
                "trayecto": "Trayecto no valido",
                "id_tipo_trayecto": 115,
                "curva": {
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
                    "type": "LineString",
                    "coordinates": [
                        [
                            -42.782353,
                            -65.056268
                        ],
                        [
                            -42.774423,
                            -65.032927
                        ],
                        [
                            -42.778118,
                            -65.03058
                        ]
                    ]
                },
                "codigo": "1239",
                "validity": [
                    {
                        "value": null,
                        "inclusive": false
                    },
                    {
                        "value": null,
                        "inclusive": false
                    }
                ],
                "descripcion": "el trayecto con id tipo zona invalido (no existe tipo_trayecto con el id_tipo_trayecto)"
            }
            """
            Entonces se obtiene la respuesta '{ "statusCode": 400, "status": "error" }'

            Escenario: Insertar un trayecto con menos de 2 coordenadas distintas

            Dado que no existe el trayecto con codigo "1240"

            Cuando se solicita insertar el trayecto con con menos de 2 coordenadas distintas
            """
            {
                "trayecto": "Trayecto no valido",
                "id_tipo_trayecto": 1,
                "curva": {
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
                    "type": "LineString",
                    "coordinates": [
                        [
                            -42.782353,
                            -65.056268
                        ],
                        [
                            -42.782353,
                            -65.056268
                        ],
                        [
                            -42.782353,
                            -65.056268
                        ]
                    ]
                },
                "codigo": "1240",
                "validity": [
                    {
                        "value": null,
                        "inclusive": false
                    },
                    {
                        "value": null,
                        "inclusive": false
                    }
                ],
                "descripcion": "el trayecto con menos de 2 coordenadas distintas"
            }
            """
            Entonces se obtiene la respuesta '{ "statusCode": 503, "status": "error", "message": "Insertar al menos 2 coordenadas distintas" }'

            Escenario: Insertar un trayecto con fecha invalida

            Dado que no existe el trayecto con codigo "1241"

            Cuando se solicita insertar el trayecto con fecha invalida
            """
            {
                "trayecto": "Trayecto no valido",
                "id_tipo_trayecto": 1,
                "curva": {
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
                    "type": "LineString",
                    "coordinates": [
                        [
                            -42.782353,
                            -65.056268
                        ],
                        [
                            -42.774423,
                            -65.032927
                        ],
                        [
                            -42.778118,
                            -65.03058
                        ]
                    ]
                },
                "codigo": "1241",
                "descripcion": "el trayecto con fecha invalida",
                "validity": [
                    {
                        "value": "2040-01-01T16:40:00.000Z",
                        "inclusive": true
                    },
                    {
                        "value": "2020-10-19T16:40:00.000Z",
                        "inclusive": true
                    }
                ]
            }
            """
Entonces se obtiene la respuesta '{ "statusCode": 505, "status": "error", "message": "Fecha Desde debe ser menor o igual que Fecha Hasta" }'
