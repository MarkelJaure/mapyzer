set search_path to mapyzer;

--UNIQUE KEYS     
    
ALTER TABLE public.proyectos
 ADD CONSTRAINT proyectos_proyecto_idusuario_UK
 UNIQUE (proyecto,id_usuario)

--FOREIGN KEYS   

ALTER TABLE public.tipos_zonas
  ADD CONSTRAINT tipos_zonas_super_fk
  FOREIGN KEY (tipo_super)
  REFERENCES public.tipos_zonas(id);

ALTER TABLE public.zonas
  ADD CONSTRAINT zonas_tipo_zona_fk
  FOREIGN KEY (id_tipo_zona)
  REFERENCES public.tipos_zonas(id);


ALTER TABLE public.zonas
  ADD CONSTRAINT zonas_super_fk
  FOREIGN KEY (zona_super)
  REFERENCES public.zonas(id);


ALTER TABLE public.lugares
  ADD CONSTRAINT lugares_tipo_lugar_fk
  FOREIGN KEY (id_tipo_lugar)
  REFERENCES public.tipos_lugares(id);


ALTER TABLE public.lugares
  ADD CONSTRAINT lugares_zona_fk
  FOREIGN KEY (id_zona)
  REFERENCES public.zonas(id);


ALTER TABLE public.trayectos
  ADD CONSTRAINT trayectos_tipo_trayecto_fk
  FOREIGN KEY (id_tipo_trayecto)
  REFERENCES public.tipos_trayectos(id);


ALTER TABLE public.trayectos
  ADD CONSTRAINT trayectos_zona_fk
  FOREIGN KEY (id_zona)
  REFERENCES public.zonas(id);

ALTER TABLE public.proyectos
  ADD CONSTRAINT proyectos_usuarios_fk
  FOREIGN KEY (id_usuario)
  REFERENCES public.usuarios(id);

ALTER TABLE public.proyectos_zonas
  ADD CONSTRAINT proyectoszonas_zona_fk
  FOREIGN KEY (id_zona)
  REFERENCES public.zonas(id);

ALTER TABLE public.proyectos_zonas
  ADD CONSTRAINT proyectoszonas_proyecto_fk
  FOREIGN KEY (id_proyecto)
  REFERENCES public.proyectos(id);


ALTER TABLE public.proyectos_lugares
  ADD CONSTRAINT proyectoslugares_lugar_fk
  FOREIGN KEY (id_lugar)
  REFERENCES public.lugares(id);

ALTER TABLE public.proyectos_lugares
  ADD CONSTRAINT proyectoslugares_proyecto_fk
  FOREIGN KEY (id_proyecto)
  REFERENCES public.proyectos(id);


ALTER TABLE public.proyectos_trayectos
  ADD CONSTRAINT proyectostrayectos_trayecto_fk
  FOREIGN KEY (id_trayecto)
  REFERENCES public.trayectos(id);

ALTER TABLE public.proyectos_trayectos
  ADD CONSTRAINT proyectostrayectos_proyecto_fk
  FOREIGN KEY (id_proyecto)
  REFERENCES public.proyectos(id);

ALTER TABLE public.usuarios 
  ADD CONSTRAINT usuario_persona_fk 
  FOREIGN KEY (id_persona) 
  REFERENCES public.personas(id);

ALTER TABLE public.personas 
  ADD CONSTRAINT persona_usuario_fk_cascade 
  FOREIGN KEY (id) 
  REFERENCES public.usuarios(id) ON DELETE CASCADE;





