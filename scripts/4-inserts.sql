INSERT INTO public.tipos_lugares(id, tipo_lugar)
VALUES (1, 'default');

INSERT INTO public.tipos_lugares(id, tipo_lugar)
VALUES (2, 'hotel');

INSERT INTO public.tipos_zonas(id, tipo_zona)
VALUES (1, 'default');

INSERT INTO public.tipos_trayectos(id, tipo_trayecto)
VALUES (1, 'default');

INSERT INTO public.usuarios(id, username, password, rol, email)
VALUES (1,'admin', '$2y$08$QHQypyMR5h2cWNJNrHwJOeqyjMG/99iItguTQ7KTcERS90pjPEEvu', 'administrador', 'admin@admin.com');

INSERT INTO public.usuarios(id, username, password, rol, email)
VALUES (2,'owner', '$2y$08$4LZnkkvNHIgPcBxarXLSZ.mjIkhZHt1P.p8zU7Wcgfkc4grQNH4Dq ', 'usuario' , 'usuario@usuario.com');

INSERT INTO public.usuarios(id, username, password, rol, email)
VALUES (3,'guest', '$2y$08$n/Vpjt7Va1PbAMnL0le35uBn3P.fWEK5mRkQFtxKFBan0RPdLW5ci ', 'invitado' , 'invitado@invitado.com');

INSERT INTO public.personas(id, name, lastname, dni, telefono, ambito, estudios)
VALUES (1, 'Adminis', 'Trador', 11111111, 2804111111, 'salud', 'educacion superior no finalizada');

INSERT INTO public.personas(id, name, lastname, dni, telefono, ambito, estudios)
VALUES (2, 'Owwwwwww', 'Nerrrrrr', 22222222, 2804222222, 'salud', 'educacion superior no finalizada');

INSERT INTO public.personas(id, name, lastname, dni, telefono, ambito, estudios)
VALUES (3, 'Elin', 'vitado', 33333333, 2804333333, 'salud', 'educacion superior no finalizada');

UPDATE public.usuarios
	SET id_persona = 1
	WHERE id = 1;

UPDATE public.usuarios
	SET id_persona = 2
	WHERE id = 2;

UPDATE public.usuarios
	SET id_persona = 3
	WHERE id = 3;

INSERT INTO public.proyectos(id, proyecto, id_usuario, descripcion, observaciones, visibilidad)
VALUES (1, 'Nombre 1er Proyecto publico de Admin', 1, 'Descripcion 1er proyecto Admin','Observaciones', 'publico');

INSERT INTO public.proyectos(id, proyecto, id_usuario, descripcion, visibilidad)
VALUES (2, 'Proyecto ciclistas', 1, 'Movimiento de ciclistas', 'publico');

INSERT INTO public.proyectos(id, proyecto, id_usuario, descripcion, observaciones, visibilidad)
VALUES (3, 'Nombre 1er Proyecto privado de Admin', 1, 'Descripcion 3er proyecto Admin','Observaciones', 'privado');

INSERT INTO public.proyectos(id, proyecto, id_usuario, descripcion, observaciones, visibilidad)
VALUES (4, 'Nombre 1er Proyecto publico de Owner', 2, 'Descripcion 1er proyecto Owner','Observaciones', 'publico');

INSERT INTO public.proyectos(id, proyecto, id_usuario, descripcion, observaciones, visibilidad)
VALUES (5, 'Nombre 1er Proyecto privado de Owner', 2, 'Descripcion 2do proyecto Owner','Observaciones', 'privado');

INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (1001, 'H001', 'Los Tulipanes Apart de mar', 1, '(,)', 
            ST_GeomFromText('POINT(
            -42.7798301 -65.0292953
            )',4326));

INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (1002, 'H002', 'La Casa del Pino', 1, '(,)', 
            ST_GeomFromText('POINT(
            -42.7807121 -65.022675
            )',4326));

INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (1003, 'H003', 'Cormoranes', 1, '(,)', 
            ST_GeomFromText('POINT(
            -42.7852658 -65.017999
            )',4326));

INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (1004, 'H004', 'Aborigen apartamentos Boutique', 1, '(,)', 
            ST_GeomFromText('POINT(
            -42.7886003 -65.0241255
            )',4326));

INSERT INTO public.lugares(
    id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (1005, 'H005', 'Los Buenos Dias', 1, '(,)', 
            ST_GeomFromText('POINT(
            -42.780049 -65.0268292
            )',4326));

INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (1006, 'H006', 'Alem', 1, '(,)', 
            ST_GeomFromText('POINT(
            -42.7780252 -65.0307559
            )',4326));

INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (1007, 'H007', 'Patagonia Apart Hotel', 1, '(,)', 
            ST_GeomFromText('POINT(
            -42.7712919 -65.0317108
            )',4326));

INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (1008, 'H008', 'Hotel Piren', 1, '(,)', 
            ST_GeomFromText('POINT(
            -42.7684014 -65.0339209
            )',4326));

INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (1009, 'H009', 'Chepatagonia Hostel', 1, '(,)', 
            ST_GeomFromText('POINT(
            -42.7715281 -65.031979
            )',4326));

INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (1010, 'H010', 'Vintage Hotel Boutique', 1, '(,)', 
            ST_GeomFromText('POINT(
            -42.7736545 -65.0296401
            )',4326));

INSERT INTO public.proyectos_lugares(
	id_proyecto, id_lugar)
	VALUES (1, 1001);
INSERT INTO public.proyectos_lugares(
	id_proyecto, id_lugar)
	VALUES (1, 1002);
INSERT INTO public.proyectos_lugares(
	id_proyecto, id_lugar)
	VALUES (3, 1003);
INSERT INTO public.proyectos_lugares(
	id_proyecto, id_lugar)
	VALUES (3, 1004);
INSERT INTO public.proyectos_lugares(
	id_proyecto, id_lugar)
	VALUES (3, 1005);
INSERT INTO public.proyectos_lugares(
	id_proyecto, id_lugar)
	VALUES (3, 1006);
INSERT INTO public.proyectos_lugares(
	id_proyecto, id_lugar)
	VALUES (4, 1007);
INSERT INTO public.proyectos_lugares(
	id_proyecto, id_lugar)
	VALUES (4, 1008);
INSERT INTO public.proyectos_lugares(
	id_proyecto, id_lugar)
	VALUES (5, 1009);
INSERT INTO public.proyectos_lugares(
	id_proyecto, id_lugar)
	VALUES (5, 1010);




