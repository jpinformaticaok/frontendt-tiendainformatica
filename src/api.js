// Cliente mínimo de la API. Usa fetch nativo para no sumar dependencias.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

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
