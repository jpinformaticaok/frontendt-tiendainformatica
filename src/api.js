// Cliente mínimo de la API. Usa fetch nativo para no sumar dependencias.
// La app apunta exclusivamente a la API del VPS (contenedor docker).
// Si cambia la IP o el puerto, se modifica únicamente esta línea.
const API_URL = 'http://100.68.210.113:5001'

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (res.status === 204) return null

  const texto = await res.text()
  const datos = texto ? JSON.parse(texto) : null

  if (!res.ok) {
    // La API devuelve { error } en validaciones y ProblemDetails en el resto.
    const mensaje = datos?.error || datos?.title || `Error ${res.status}`
    throw new Error(mensaje)
  }

  return datos
}

export const api = {
  health: () => request('/health'),

  categorias: {
    listar: () => request('/categorias'),
    obtener: (id) => request(`/categorias/${id}`),
    productos: (id) => request(`/categorias/${id}/productos`),
    crear: (datos) =>
      request('/categorias', { method: 'POST', body: JSON.stringify(datos) }),
  },

  marcas: {
    listar: () => request('/marcas'),
    crear: (datos) =>
      request('/marcas', { method: 'POST', body: JSON.stringify(datos) }),
  },

  productos: {
    listar: () => request('/productos'),
    obtener: (id) => request(`/productos/${id}`),
    crear: (datos) =>
      request('/productos', { method: 'POST', body: JSON.stringify(datos) }),
    actualizar: (id, datos) =>
      request(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
    eliminar: (id) => request(`/productos/${id}`, { method: 'DELETE' }),
  },
}

export { API_URL }
