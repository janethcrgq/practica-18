import { Link, useNavigate, useParams } from "react-router";
import { useClase } from "../hooks/useClase";
import { MensajeError } from "../componentes/MensajeError";
import { Cargando } from "../componentes/Cargando";
import { estadoDeError, urlImagen } from "../servicios/api";
import { useSesion } from "../sesion/SesionContext";
import { useState } from "react";
import { inscribirse } from "../servicios/gimnasio";
import { useInscripciones } from "../estado/inscripciones";

interface Aviso{
  texto: string,
  tipo: 'exito' | 'error'
}

export default function PaginaClase() {
  const { id } = useParams();

  const { clase, cargando, error, reintentar } = useClase(Number(id));
  const navegar = useNavigate();
  const { usuario }= useSesion();
  const [ aviso, setAviso]= useState<Aviso | null>(null);




  const misInscripciones= useInscripciones(estado=> estado.lista);
  const cargarInscripciones= useInscripciones((estado=> estado.cargar))

  if (cargando) return <Cargando />;
  if (error)
    return (
      <MensajeError
        mensaje={error ?? "ocurrio un error al cargar la clase "}
        onReintentar={reintentar}
      />
    );

  if (!clase)
    return (
      <MensajeError
        mensaje={error ?? "ocurrio un error al cargar la clase "}
        onReintentar={reintentar}
      />
    );

    async function inscribir(horarioId: number){
      if(!usuario){
        setAviso({tipo: "error", texto: "Necesitas inciar sesion para inscribirte"});
        return;
      }
      try{
        await inscribirse(horarioId);
        cargarInscripciones();
        navegar('/mis-inscripciones')
      } catch(e){
        if(estadoDeError(e)=== 409){
          setAviso({tipo: "error", texto: "ya te encuentras inscrito en esta clase"});
        }  else if(estadoDeError(e) === 401){
          navegar("/entrar")

        }else{
          setAviso({tipo: "error", texto: "no se pudo completar la inscripcion"})
        }
      }
    }
  return (
    <>
      <Link to="/clases" className="detalle_volver">
        {" "}
        Todas las clases
      </Link>
      <article className="detalle">
        <img
          className="detalle__imagen"
          src={urlImagen(clase.imagen)}
          alt={clase.nombre}
          loading= "lazy"
        />
        <div className="detalle__datos">
          <span className="etiqueta etiqueta--fuerza">{clase.categoria}</span>
          <h1>{clase.nombre}</h1>
          <p className="pagina__bajada">
            {clase.descripcion} · {clase.duracionMin} min
          </p>

          <h2>Horarios</h2>
          { aviso && <p className={ `aviso aviso--${aviso.tipo}`}> {aviso.texto} </p>}
          <ul className="horarios">
            {clase.horarios.map((h) => (
              <li key={h.id} className="horario">
                <div>
                  <div className="horario__dia">
                    {h.dia} · {h.horaInicio}
                  </div>
                  <div className="horario__meta">
                    {h.entrenador} · {h.disponibles} de {h.cupoMaximo} lugares
                  </div>
                </div>


                { 
                  misInscripciones.some((i)=> i.horario.id === h.id) ? (
                    <span> Ya estas inscrito</span>
                  ) : h.disponibles === 0?(
                    <span> Cupo lleno </span>
                  ): (
                  <button className="boton boton--chico" onClick= {()=> inscribir(h.id)}>Inscribirme</button>
                  )
              }
              </li>
            ))}
          </ul>
        </div>
      </article>
    </>
  );
}
