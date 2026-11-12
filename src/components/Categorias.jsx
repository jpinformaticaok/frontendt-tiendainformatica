import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { api } from '../api.js'
import Modal from './Modal.jsx'
import CategoriaForm from './CategoriaForm.jsx'

export default function Categorias({ onVerProductos }) {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [creando, setCreando] = useState(false)

  async function cargar() {
    try {
      setCargando(true)
      setCategorias(await api.categorias.listar())
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  async function guardar(datos) {
    try {
      await api.categorias.crear(datos)
      Swal.fire({
        icon: 'success',
        title: 'Categoría creada',
        timer: 1500,
        showConfirmButton: false,
      })
      setCreando(false)
      await cargar()
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'No se pudo crear', text: e.message })
    }
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h1 className="h4 mb-0">Categorías</h1>
          <small className="text-muted">{categorias.length} categorías</small>
        </div>
        <button className="btn btn-primary" onClick={() => setCreando(true)}>
          + Nueva categoría
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          No se pudieron cargar las categorías: {error}
        </div>
      )}

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {categorias.map((c) => (
            <div className="col-12 col-md-6 col-lg-4" key={c.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h2 className="h5 card-title mb-1">{c.nombre}</h2>
                    <span className="badge bg-primary">{c.totalProductos}</span>
                  </div>
                  <p className="card-text text-muted small mb-3">
                    {c.descripcion || 'Sin descripción'}
                  </p>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onVerProductos(c.id)}
                  >
                    Ver productos
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {creando && (
        <Modal titulo="Nueva categoría" onClose={() => setCreando(false)}>
          <CategoriaForm
            onGuardar={guardar}
            onCancelar={() => setCreando(false)}
          />
        </Modal>
      )}
    </>
  )
}
