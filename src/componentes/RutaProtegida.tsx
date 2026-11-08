import { Navigate, Outlet, useLocation } from "react-router";
import { useSesion } from "../sesion/SesionContext";

export function RutaProtegida(){
  const { usuario }= useSesion();
  const ubicacion= useLocation();

  if(!usuario){
    // guarda en el state un objeto con el atributo desde, que guarda la ruta actual del usuario 
    return <Navigate to="/entrar" replace state= {{desde: ubicacion.pathname}}/>
  }
  // contenido del componente que se esta solicitando desde el inicio
  return <Outlet/>

  
}