import { Link } from "react-router";
import { Cargando } from "../componentes/Cargando";
import { MensajeError } from "../componentes/MensajeError";
import { useClases } from "../hooks/useClases";
import { urlImagen } from "../servicios/api";

export default function PaginaClases(){
  const { clases, cargando, error, reintentar } = useClases();

  return (
    <>

    <section className="pagina__encabezado">
      <h1>Clases</h1>
      <p className="pagina__bajada">Elige una clase para ver sus horarios e inscribirte.</p>
    </section>

  
    {cargando && <Cargando />}
    {error && <MensajeError mensaje={error} onReintentar={reintentar} /> }
    {!cargando && !error && (


    <div className="rejilla">
      {
          clases.map((c)=>(
            //al hacer click te lleva a /clases/1 por ejemplo
              <Link key={c.id} to={`/clases/${c.id}`} className="tarjeta-clase">
              <img className="tarjeta-clase__imagen" src={urlImagen(c.imagen)} alt={c.nombre} loading="lazy"/>
              <div className="tarjeta-clase__cuerpo">
                <span className="etiqueta etiqueta--fuerza">{c.categoria}</span>
                <span className="tarjeta-clase__titulo">{c.nombre}</span>
                <span className="tarjeta-clase__meta">{c.duracionMin} min</span>
              </div>
            </Link>
          ))
      }
      

    </div>
  )}

  </>


    );

}