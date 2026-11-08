# Práctica 15

Capturas en `evidencias/practica15/`.

## Ejercicio 1: el router y el catálogo

### ¿Por qué el 404 sí tiene encabezado y pie?

Porque la ruta `*` (la del 404) está definida como hija de la ruta de layout. El `<Layout>`
siempre pinta el `<Encabezado>` y el `<PiePagina>`, y en medio tiene un `<Outlet />`, que es
el hueco donde React Router pinta la ruta hija que coincide con la URL. Cuando la dirección
no existe, la ruta que coincide es `*`, así que `<NoEncontrado>` se pinta dentro del
`<Outlet />` y el encabezado y el pie se quedan.

### ¿Qué cambia en la pestaña Red si usas `<a href>` en lugar de `Link`?

Con `Link`, React Router intercepta el clic, cambia la URL sin recargar y solo pinta la nueva
ruta. En la pestaña Red solo aparece lo nuevo: la petición a la API con la clase y el código
de la página de detalle (6 peticiones en `p15-red-link.png`).

Con `<a href>`, el navegador hace una navegación completa: vuelve a pedir el documento HTML
(la primera fila es de tipo *document*), todos los archivos de JavaScript, el CSS, el logo y
otra vez las peticiones a la API (41 peticiones en `p15-red-a-href.png`). La aplicación
arranca desde cero y se pierde el estado que estaba en memoria.

## Ejercicio 2: el detalle de una clase

### ¿En qué tipo de dato llega el id de la URL y qué pasa si no lo conviertes?

`useParams` siempre regresa texto (`string`, o `undefined` si el parámetro no existe), porque
la URL es texto: en `/clases/1` el id llega como `"1"`, no como `1`. Si no se convierte,
TypeScript marca error al pasarlo a `useClase(id: number)`, y las comparaciones con números
fallan (`"1" === 1` es `false`). Por eso se convierte con `Number(id)`. Si la URL trae algo
que no es número, como `/clases/abc`, el resultado es `NaN` y la API responde con error.

### ¿Qué pasa al ir de `/clases/1` a `/clases/2` si el id no está en las dependencias del efecto?

Como las dos direcciones usan la misma ruta, React Router no desmonta `<PaginaClase>`: solo
le cambia el parámetro. Si el efecto no tiene el `id` en sus dependencias, no se vuelve a
ejecutar, así que no se pide la clase 2 y la página sigue mostrando la clase 1 aunque la URL
diga `/clases/2`. Con `[id, intento]` el efecto se repite cada vez que cambia el id, pide la
clase nueva y la limpieza (`vigente = false`) descarta la respuesta de la clase anterior si
llega tarde.

# Práctica 18

Capturas en `evidencias/`.

## Ejercicio 1: partir por ruta y medir

### ¿Cuánto se ahorró y por qué el ahorro es pequeño en esta aplicación?

El archivo principal bajó de 327.81 kB a 322.87 kB: unos 5 kB, o 0.75 kB en gzip, menos del 2 %.
El ahorro es pequeño porque las páginas son muy chicas (de 1 a 2.5 kB cada una). Casi todo
el peso del archivo principal son las librerías que se necesitan desde el inicio en cualquier
ruta: React, React DOM, React Router, Axios y Zustand. Esas no se pueden separar por ruta,
así que partir el código solo saca de la carga inicial el código propio de las páginas.
En una aplicación con páginas grandes, o con librerías pesadas que usa una sola página
(gráficas, editores, mapas), el ahorro sería mucho mayor.

### ¿Por qué falla la API si el preview corre en el puerto 4173?

El backend tiene configurado CORS (`app.enableCors` en `main.ts`) para aceptar peticiones solo
de los orígenes `http://localhost:5173` y `http://localhost:5174`, que son los puertos de desarrollo de Vite. `vite preview` usa por defecto el puerto 4173, que es otro origen (el origen incluye el puerto). El navegador manda la
petición, el backend no responde con el encabezado `Access-Control-Allow-Origin` para ese
origen y el navegador bloquea la respuesta (error de CORS). Por eso el preview se sirve con
`npx vite preview --port 5173`.

## Ejercicio 2: un store para las inscripciones

### ¿Cuándo conviene un contexto y cuándo un store?

- **Contexto**: para valores que cambian poco y que casi todo el árbol necesita, como la
  sesión, el tema o el idioma. Viene incluido en React, no necesita librerías, y le sirve al
  proveedor para envolver la aplicación. Su desventaja es que cada vez que cambia el valor
  se vuelven a renderizar todos los componentes que lo consumen.
- **Store (Zustand)**: para datos que cambian seguido y que comparten varias páginas o
  componentes lejanos, como las inscripciones (el encabezado, el detalle de la clase y Mis
  inscripciones). Cada componente se suscribe solo a la parte que usa (por ejemplo
  `estado => estado.lista.length`), así que solo se renderiza cuando esa parte cambia. Además
  se puede leer y modificar fuera de los componentes (`useInscripciones.getState()`) y no
  necesita proveedor.
