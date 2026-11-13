# frontendt-tiendainformatica

Frontend en **React + Vite** que consume la API de `TiendaInformatica`.
Usa **Bootstrap 5** para la interfaz y **SweetAlert2** para confirmaciones y avisos.

## Requisitos

- Node.js 20 o superior
- La API de `TiendaInformatica` corriendo (por defecto en `http://localhost:5001`)

## Instalación

```bash
npm install
```

## Configuración

La app apunta **exclusivamente a la API del VPS** (el contenedor docker).
La URL está fija en `src/api.js`:

```js
const API_URL = 'http://100.68.210.113:5001'
```

Si cambia la IP o el puerto, se modifica únicamente esa línea. No usa variables
de entorno ni archivos `.env`.

## Correr en desarrollo

```bash
npm run dev
```

Abre `http://localhost:5173`.

## Build para producción

```bash
npm run build
```

Genera la carpeta `dist/` con archivos estáticos. Se puede servir con cualquier
servidor web:

```bash
npx serve dist
# o
python3 -m http.server 4173 --directory dist
```

## Consumir la API del VPS

La app siempre llama a `http://100.68.210.113:5001`. Para que el navegador pueda
hacerlo desde otro origen, la API tiene CORS habilitado.

- Si en el VPS dejaste `CORS_ALLOWED_ORIGINS` vacío, acepta cualquier origen.
- Si lo configuraste, agregá la URL del frontend, por ejemplo:

  ```
  CORS_ALLOWED_ORIGINS=http://localhost:5173,http://100.68.210.113:4173
  ```

  y reiniciá la API con `docker compose up -d` en el VPS.

La IP `100.68.210.113` es de Tailscale: la computadora desde donde abrís el
frontend tiene que estar en la misma red (tailnet).

## Funcionalidades

- **Productos**
  - Listado con búsqueda por nombre/marca y filtro por categoría.
  - Crear, editar y eliminar (con confirmación de SweetAlert2).
  - Precio formateado en pesos argentinos y stock con semáforo.
- **Categorías**
  - Listado en tarjetas con la cantidad de productos.
  - Crear categoría.
  - Botón "Ver productos" que filtra el listado de productos.
- **Marcas**
  - Listado con la cantidad de productos de cada marca.
  - Crear marca (el nombre no se puede repetir).
- **Estado de la API**
  - Indicador en la barra superior y chequeo cada 20 segundos contra `/health`.

## Estructura

```
index.html
vite.config.js
src/
  main.jsx              → punto de entrada + Bootstrap
  App.jsx               → vista activa y estado de la API
  api.js                → cliente fetch de los endpoints
  styles.css
  components/
    Navbar.jsx
    Productos.jsx
    ProductoForm.jsx
    Categorias.jsx
    CategoriaForm.jsx
    Marcas.jsx
    MarcaForm.jsx
    Modal.jsx
```

## Endpoints consumidos

| Método | Ruta | Uso |
|---|---|---|
| GET | `/health` | Indicador de conexión |
| GET | `/productos` | Listado de productos |
| POST | `/productos` | Crear producto |
| PUT | `/productos/{id}` | Editar producto |
| DELETE | `/productos/{id}` | Eliminar producto |
| GET | `/categorias` | Listado de categorías |
| POST | `/categorias` | Crear categoría |
| GET | `/marcas` | Listado de marcas |
| POST | `/marcas` | Crear marca |
