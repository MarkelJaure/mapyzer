set search_path to mapyzer,public;

CREATE TABLE IF NOT EXISTS public.tipos_zonas (
  id SERIAL PRIMARY KEY,
  tipo_zona VARCHAR(60) NOT NULL UNIQUE,
  tipo_super INTEGER,
  id_zonificacion INTEGER,
  json_schema JSONB,
  tipo_linea VARCHAR(60),
  color VARCHAR(20),
  color_relleno VARCHAR(20),
  descripcion VARCHAR(400),
  observaciones VARCHAR(2000),
  usrgen VARCHAR(60) DEFAULT user,
  timegen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sourcegen VARCHAR(60)
);


CREATE TABLE IF NOT EXISTS public.tipos_trayectos (
  id SERIAL PRIMARY KEY,
  tipo_trayecto VARCHAR(60) NOT NULL UNIQUE,
  clasificador VARCHAR(60),
  linea INTEGER,
  tipo_linea VARCHAR(60),
  color VARCHAR(20),
  json_schema JSONB,
  descripcion VARCHAR(400),
  observaciones VARCHAR(2000),
  usrgen VARCHAR(60) DEFAULT user,
  timegen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sourcegen VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS public.tipos_lugares (
  id SERIAL PRIMARY KEY,
  tipo_lugar VARCHAR(60) NOT NULL UNIQUE,
  clasificador VARCHAR(60),
  tipo_marcador Enum_tipo_marcador ,
  icono VARCHAR(60),
  size INTEGER,
  color VARCHAR(20),
  json_schema JSONB,
  descripcion VARCHAR(400),
  observaciones VARCHAR(2000),
  usrgen VARCHAR(60) DEFAULT user,
  timegen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sourcegen VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS public.zonas (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(40),
  zona VARCHAR(120) NOT NULL,
  zona_super INTEGER,
  id_tipo_zona INTEGER NOT NULL,
  poligono geometry(Polygon,4326),
  punto_ref geometry(Point,4326),
  json_data JSONB,
  descripcion VARCHAR(400),
  observaciones VARCHAR(2000),
  usrgen VARCHAR(60) DEFAULT user,
  timegen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sourcegen VARCHAR(60),
  validity TSTZRANGE,
  isvalid BOOLEAN default true
);


CREATE TABLE IF NOT EXISTS public.lugares (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(40),
  lugar VARCHAR(120) NOT NULL,
  id_zona INTEGER,
  id_tipo_lugar INTEGER NOT NULL,
  localizacion VARCHAR(200),
  punto geometry(Point,4326) NOT NULL,
  json_data JSONB,
  descripcion VARCHAR(400),
  observaciones VARCHAR(2000),
  usrgen VARCHAR(60) DEFAULT user,
  timegen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sourcegen VARCHAR(60),
  validity TSTZRANGE,
  isvalid BOOLEAN default true
);


CREATE TABLE IF NOT EXISTS public.trayectos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(40),
  trayecto VARCHAR(120) NOT NULL,
  id_zona INTEGER,
  id_tipo_trayecto INTEGER NOT NULL,
  curva geometry(Linestring,4326) NOT NULL,
  momentos TIMESTAMP WITH TIME ZONE[],
  json_data JSONB,
  descripcion VARCHAR(400),
  observaciones VARCHAR(2000),
  usrgen VARCHAR(60) DEFAULT user,
  timegen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sourcegen VARCHAR(60),
  validity TSTZRANGE,
  isvalid BOOLEAN default true
);


CREATE TABLE IF NOT EXISTS public.usuarios (
  id SERIAL PRIMARY KEY,
  username VARCHAR(60) NOT NULL UNIQUE,
  password VARCHAR(60) NOT NULL,
  rol Enum_rol,
  id_persona INTEGER,
  email character varying UNIQUE,
  token character varying  
);

CREATE TABLE IF NOT EXISTS public.personas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  lastname VARCHAR(60) NOT NULL,
  dni BIGINT NOT NULL UNIQUE,
  telefono BIGINT NOT NULL,
  ambito Enum_ambitos,
  estudios Enum_estudios NOT NULL
);

CREATE TABLE IF NOT EXISTS public.proyectos (
  id SERIAL PRIMARY KEY,
  proyecto VARCHAR(60) NOT NULL,
  id_usuario INTEGER NOT NULL,
  descripcion VARCHAR(400),
  observaciones VARCHAR(2000),
  usrgen VARCHAR(60) DEFAULT user,
  timegen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sourcegen VARCHAR(60),
  visibilidad character varying,
  isvalid BOOLEAN default true
);


CREATE TABLE IF NOT EXISTS public.proyectos_zonas (
  id_proyecto INTEGER,
  id_zona INTEGER,
  PRIMARY KEY (id_proyecto,id_zona)
);

CREATE TABLE IF NOT EXISTS public.proyectos_lugares (
  id_proyecto INTEGER,
  id_lugar INTEGER,
  PRIMARY KEY (id_proyecto,id_lugar)
);

CREATE TABLE IF NOT EXISTS public.proyectos_trayectos (
  id_proyecto INTEGER,
  id_trayecto INTEGER,
  PRIMARY KEY (id_proyecto,id_trayecto)
);

CREATE TABLE IF NOT EXISTS public.direcciones (
    id serial NOT NULL,
    descripcion varchar(400) NULL,
    codigo varchar(40) NULL,
    ciudad varchar(120) NULL,
    altura varchar(120) NULL,
    calle varchar(120) NULL,
    "tipoLugar" varchar(120) NULL,
    nombre varchar(120) NULL,
    "tInicio" varchar(120) NULL,
    "tFinal" varchar(120) NULL,
    procesado bool NULL DEFAULT false,
    proyecto_id int4 NULL,
    CONSTRAINT direcciones_pkey PRIMARY KEY (id)
);
