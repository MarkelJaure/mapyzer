# language: es

Característica: Insertar Proyectos a la base de datos, verificando que todas las condiciones se cumplan

Como Dueño de los datos
Quiero Dar de baja un proyecto propio
Para Mantener activos solo mis proyectos de interés

#--------------------------------------------------------------------------------------------------------------------------------------------------#

            Escenario: Insertar un proyecto valido de un usuario a la base de datos

            Dado que no existe el proyecto con nombre "proyecto_testing" de "Markel"

            Cuando se solicita insertar el proyecto valido
            """
            {
                "proyecto": "proyecto_testing",
                "id_usuario": 1,
                "visibilidad": "privado",
                "descripcion": "Proyecto insertado desde el testing"
            }
            """
            Entonces se obtiene la respuesta del proyecto '{ "statusCode": 200,"status": "success","message": "Proyecto agregado","data": {"proyecto": "proyecto_testing", "id_usuario": 1, "descripcion": "Proyecto insertado desde el testing","visibilidad": "privado"}}'

#--------------------------------------------------------------------------------------------------------------------------------------------------#

            Escenario: Insertar un proyecto de un usuario con nombre repetido a la base de datos

            Dado que existe el usuario con el username "Markel" y posee el proyecto el proyecto con nombre "proyecto_testing" 

            Cuando se solicita insertar el proyecto con nombre repetido
            """
            {
                "proyecto": "proyecto_testing",
                "id_usuario": 1,
                "visibilidad": "privado",
                "descripcion": "Proyecto insertado desde el testing"
            }
            """
            Entonces se obtiene la respuesta del proyecto '{"statusCode":400,"status":"error","message":"Usted ya tiene un proyecto con ese nombre. Por favor, cambie el nombre."}'

#--------------------------------------------------------------------------------------------------------------------------------------------------#

            Escenario: Actualizar un proyecto valido de la base de datos

            Dado que existe el usuario con el username "Markel" y posee el proyecto el proyecto con nombre "proyecto_testing" 

            Cuando se solicita actualizar el proyecto en la base de datos
            """
            {
                "proyecto": "proyecto_testing",
                "id_usuario": 1,
                "visibilidad": "privado",
                "descripcion": "Proyecto insertado desde el testing y fue actualizado"
            }
            """
            Entonces se obtiene la respuesta del proyecto '{ "statusCode": 200,"status": "success","message": "Proyecto actualizado","data": {"proyecto": "proyecto_testing", "id_usuario": 1, "descripcion": "Proyecto insertado desde el testing y fue actualizado","visibilidad": "privado"}}'

#--------------------------------------------------------------------------------------------------------------------------------------------------#

            Escenario: Dar de baja un proyecto que no existe en mis proyectos

            Dado que no existe el proyecto con nombre "proyecto_testing_no_existente" de "Markel"

            Cuando se solicita dar de baja el proyecto inexistente
            """
            {
                "proyecto": "proyecto_testing_no_existente",
                "id_usuario": 1,
                "visibilidad": "privado",
                "descripcion": "Proyecto insertado desde el testing"
            }
            """
            Entonces se obtiene la respuesta del proyecto '{ "statusCode": 400, "status": "error", "message": "Por favor ingrese un valor numérico" }'

#--------------------------------------------------------------------------------------------------------------------------------------------------#

            Escenario: Dar de baja un proyecto que existe en mis proyectos

            Dado que existe el usuario con el username "Markel" y posee el proyecto el proyecto con nombre "proyecto_testing" 

            Cuando se solicita dar de baja el proyecto existente
            """
            {
                "proyecto": "proyecto_testing",
                "id_usuario": 1,
                "visibilidad": "privado",
                "descripcion": "Proyecto insertado desde el testing y fue actualizado"
            }
            """
            Entonces se obtiene la respuesta del proyecto '{ "statusCode": 200,"status": "success","message": "Proyecto dado de baja","data": {"proyecto": "proyecto_testing", "id_usuario": 1, "descripcion": "Proyecto insertado desde el testing y fue actualizado","visibilidad": "privado", "isvalid":false}}'

#--------------------------------------------------------------------------------------------------------------------------------------------------#

