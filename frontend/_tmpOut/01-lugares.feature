            # language: es

            Característica: Insertar lugares

            # Primer escenario --------------------------------------------

            Escenario: insertar un lugar que no existe la base de datos

            Dado el lugar a insertar con codigo "1234" que no existe en la BD
            Cuando se solicita insertar el lugar
            """
            {
                "lugar": "Lugar desde el feature",
                "id_proyecto": 2,
                "id_tipo_lugar": 1,
                "punto": {
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
                    "type": "Point",
                    "coordinates": [
                        -42.7825,
                        -65.0561348
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
                "descripcion": "Lugar que pudo ser insertado desde el feature"
            }
            """
            Entonces se obtiene la siguiente respuesta
            """
            {
                "statusCode": 200,
                "status": "success",
                "message": "Lugar agregado",
                "data": {
                    "lugar": "Lugar desde el feature",
                    "punto": {
                        "crs": {
                            "type": "name",
                            "properties": {
                                "name": "EPSG:4326"
                            }
                        },
                        "type": "Point",
                        "coordinates": [
                            -42.7825,
                            -65.0561348
                        ]
                    },
                    "codigo": "1234",
                    "id_tipo_lugar": 1,
                    "descripcion": "Lugar que pudo ser insertado desde el feature"
                }
            }
            """
            # Segundo escenario --------------------------------------------

            Escenario: insertar un lugar que no existe con latitud incorrecta

            Dado el lugar a insertar con codigo "6789" que no existe en la BD
            Cuando se solicita insertar el lugar con coordenada incorrecta
            """
            {
                "lugar": "Lugar con latitud incorrecta",
                "id_zona": 99,
                "id_tipo_lugar": 1,
                "punto": {
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
                    "type": "Point",
                    "coordinates": [
                        -91.2356,
                        0
                    ]
                },
                "codigo": "6789",
                "descripcion": "Lugar que no pudo ser insertado por latitud incorrecta"
            }
            """
            Entonces se obtiene la siguiente respuesta de error
            """
            {
                "statusCode": 502,
                "status": "error",
                "message": "La latitud debe ser entre -90 y 90"
            }
            """

            # Tercer escenario --------------------------------------------

            Escenario: insertar un lugar que no existe con longitud incorrecta

            Dado el lugar a insertar con codigo "6789" que no existe en la BD
            Cuando se solicita insertar el lugar con coordenada incorrecta
            """
            {
                "lugar": "Lugar con longitud incorrecta",
                "id_zona": 99,
                "id_tipo_lugar": 1,
                "punto": {
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
                    "type": "Point",
                    "coordinates": [
                        0,
                        181
                    ]
                },
                "codigo": "6789",
                "descripcion": "Lugar que no pudo ser insertado por longitud incorrecta"
            }
            """
            Entonces se obtiene la siguiente respuesta de error
            """
            {
                "statusCode": 502,
                "status": "error",
                "message": "La longitud debe ser entre -180 y 180"
            }
            """


            Escenario: actualizar un lugar con informacion valida

            Dado el lugar a insertar con codigo "1234" que existe en la BD
            Cuando se solicita actualizar el lugar
            """
            {
                "lugar": "Lugar desde el feature actualizado",
                "id_zona": 99,
                "id_tipo_lugar": 1,
                "punto": {
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
                    "type": "Point",
                    "coordinates": [
                        -42.7825,
                        -65.0561348
                    ]
                },
                "codigo": "1234",
                "descripcion": "Lugar que pudo ser insertado desde el feature y actualizado"
            }
            """
            Entonces se obtiene la respuesta
            """
            {
                "statusCode": 200,
                "status": "success",
                "message": "Lugar actualizado",
                "data": {
                    "lugar": "Lugar desde el feature actualizado",
                    "id_zona": 99,
                    "id_tipo_lugar": 1,
                    "punto": {
                        "crs": {
                            "type": "name",
                            "properties": {
                                "name": "EPSG:4326"
                            }
                        },
                        "type": "Point",
                        "coordinates": [
                            -42.7825,
                            -65.0561348
                        ]
                    },
                    "codigo": "1234",
                    "descripcion": "Lugar que pudo ser insertado desde el feature y actualizado"
                }
            }
            """

            Escenario: insertar un lugar que no existe con una coordenada no numerica

            Dado el lugar a insertar con codigo "1235" que no existe en la BD

            Cuando se solicita insertar el lugar con coordenada que no es un numero
            """
            {
                "lugar": "Lugar con coordenada no numerica",
                "id_zona": 99,
                "id_tipo_lugar": 1,
                "punto": {
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
                    "type": "Point",
                    "coordinates": [
                        "a",
                        -65.0561348
                    ]
                },
                "codigo": "1234",
                "descripcion": "Lugar que tiene una coordenada que es un numero"
            }
            """
            Entonces se obtiene la siguiente respuesta de error
            """
            {
                "statusCode": 503,
                "status": "error",
                "message": "Las coordenadas deben ser números"
            }
            """