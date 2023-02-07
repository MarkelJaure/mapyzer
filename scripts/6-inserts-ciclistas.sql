INSERT INTO public.tipos_lugares(id, tipo_lugar, color)
VALUES (1003, 'ciclista1', 'orange');

INSERT INTO public.tipos_lugares(id, tipo_lugar, color)
VALUES (1004, 'ciclista2', 'blue');


-- Comienzo recorrido ciclista 1

INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2001, 'C001', 'Posicion 1', 1003, '["2019-12-10 10:00:00-03","2019-12-10 10:01:02-03"]', 
           ST_GeomFromText('POINT(-42.7715281 -65.031979)',4326));
           
INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2002, 'C001', 'Posicion 2', 1003, '["2019-12-10 10:01:03-03","2019-12-10 10:02:05-03"]', 
           ST_GeomFromText('POINT(-42.770518 -65.029659)',4326));
           
INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2003, 'C001', 'Posicion 3', 1003, '["2019-12-10 10:02:06-03","2019-12-10 10:03:08-03"]', 
           ST_GeomFromText('POINT(-42.772377 -65.027939)',4326));
           
INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2004, 'C001', 'Posicion 4', 1003, '["2019-12-10 10:03:09-03","2019-12-10 10:04:11-03"]', 
           ST_GeomFromText('POINT(-42.774285 -65.026268)',4326));
           
INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2005, 'C001', 'Posicion 5', 1003, '["2019-12-10 10:04:12-03","2019-12-10 10:05:14-03"]', 
           ST_GeomFromText('POINT(-42.775234 -65.025139)',4326));
           
INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2006, 'C001', 'Posicion 6', 1003, '["2019-12-10 10:07:03-03","2019-12-10 10:08:05-03"]', 
           ST_GeomFromText('POINT(-42.774285 -65.026268)',4326));
           
INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2007, 'C001', 'Posicion 7', 1003, '["2019-12-10 10:08:06-03","2019-12-10 10:09:08-03"]', 
           ST_GeomFromText('POINT(-42.772377 -65.027939)',4326));
           
INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2008, 'C001', 'Posicion 8', 1003, '["2019-12-10 10:09:09-03","2019-12-10 10:10:11-03"]', 
           ST_GeomFromText('POINT(-42.770518 -65.029659)',4326));
           
INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2009, 'C001', 'Posicion 9', 1003, '["2019-12-10 10:10:12-03","2019-12-10 10:30:14-03"]', 
           ST_GeomFromText('POINT(-42.7715281 -65.031979)',4326));
           
--Comienzo recorrido ciclista 2         

INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2010, 'C002', 'Posicion 1', 1004, '["2019-12-10 10:00:00-03","2019-12-10 10:12:20-03"]', 
           ST_GeomFromText('POINT(-42.7715281 -65.031979)',4326));
           
INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2011, 'C002', 'Posicion 2', 1004, '["2019-12-10 10:13:03-03","2019-12-10 10:14:05-03"]', 
           ST_GeomFromText('POINT(-42.769936 -65.030898)',4326));
           
INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2012, 'C002', 'Posicion 3', 1004, '["2019-12-10 10:15:06-03","2019-12-10 10:16:08-03"]', 
           ST_GeomFromText('POINT(-42.768106 -65.032010)',4326));
           
INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2013, 'C002', 'Posicion 4', 1004, '["2019-12-10 10:17:17-03","2019-12-10 10:18:18-03"]', 
           ST_GeomFromText('POINT(-42.766003 -65.033335)',4326));
           
INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2014, 'C002', 'Posicion 5', 1004, '["2019-12-10 10:19:19-03","2019-12-10 10:20:20-03"]', 
           ST_GeomFromText('POINT(-42.763805 -65.034730)',4326));
           
INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2015, 'C002', 'Posicion 6', 1004, '["2019-12-10 10:21:00-03","2019-12-10 10:22:02-03"]', 
           ST_GeomFromText('POINT(-42.764724 -65.037954)',4326));
           
INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2016, 'C002', 'Posicion 7', 1004, '["2019-12-10 10:23:03-03","2019-12-10 10:24:05-03"]', 
           ST_GeomFromText('POINT(-42.763483 -65.039821)',4326));
           
INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2017, 'C002', 'Posicion 8', 1004, '["2019-12-10 10:25:06-03","2019-12-10 10:26:08-03"]', 
           ST_GeomFromText('POINT(-42.761451 -65.042122)',4326));
           
INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2018, 'C002', 'Posicion 9', 1004, '["2019-12-10 10:27:09-03","2019-12-10 10:28:11-03"]', 
           ST_GeomFromText('POINT(-42.759848 -65.045480)',4326));
           
INSERT INTO public.lugares(id, codigo, lugar, id_tipo_lugar,validity,punto)
    VALUES (2019, 'C002', 'Posicion 10', 1004, '["2019-12-10 10:29:12-03","2019-12-10 10:30:14-03"]', 
           ST_GeomFromText('POINT(-42.757946 -65.049584)',4326));
           
-- Inserts de los id's lugares y proyectos
            
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2001);
	
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2002);
	
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2003);
	
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2004);
	
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2005);
	
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2006);
	
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2007);
	
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2008);
	
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2009);
	
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2010);
	
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2011);
	
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2012);
	
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2013);
	
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2014);
	
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2015);
	
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2016);
	
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2017);
	
INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2018);

INSERT INTO public.proyectos_lugares(id_proyecto, id_lugar)
	VALUES (2, 2019);

