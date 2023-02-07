set search_path to bdgeo;

CREATE TYPE public.Enum_tipo_marcador AS ENUM ('icono', 'circulo', 'cuadrado', 'square', 'diamond', 'star');

CREATE TYPE public.Enum_tipo_entidad AS ENUM ('zona', 'lugar', 'trayecto');

CREATE TYPE public.Enum_rol AS ENUM ('administrador', 'usuario', 'invitado');

CREATE TYPE public.Enum_dimension AS ENUM ('economica', 'social', 'salud','ambiental','gobierno');

CREATE TYPE public.Enum_estudios AS ENUM ('educacion inicial no finalizada', 'educacion inicial finalizada', 'educacion primaria no finalizada', 'educacion primaria finalizada','educacion secundaria no finalizada','educacion secundaria finalizada','educacion superior no finalizada','educacion superior finalizada');

CREATE TYPE public.Enum_ambitos AS ENUM ('salud', 'educacion', 'seguridad','transporte','finanzas','comercio','industria',' comunicacion');
