import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { api } from '../api.js'
import Modal from './Modal.jsx'
import MarcaForm from './MarcaForm.jsx'

export default function Marcas() {
  const [marcas, setMarcas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [creando, setCreando] = useState(false)

  async function cargar() {
    try {
      setCargando(true)
      setMarcas(await api.marcas.listar())
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
      await api.marcas.crear(datos)
      Swal.fire({
        icon: 'success',
        title: 'Marca creada',
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
          <h1 className="h4 mb-0">Marcas</h1>
          <small className="text-muted">{marcas.length} marcas</small>
        </div>
        <button className="btn btn-primary" onClick={() => setCreando(true)}>
          + Nueva marca
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          No se pudieron cargar las marcas: {error}
        </div>
      )}

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Marca</th>
                  <th scope="col" className="text-center">Productos</th>
                </tr>
              </thead>
              <tbody>
                {marcas.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-muted py-4">
                      No hay marcas cargadas.
                    </td>
                  </tr>
                ) : (
                  marcas.map((m) => (
                    <tr key={m.id}>
                      <td className="text-muted">{m.id}</td>
                      <td className="fw-semibold">{m.nombre}</td>
                      <td className="text-center">
                        <span className="badge bg-primary">{m.totalProductos}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {creando && (
        <Modal titulo="Nueva marca" onClose={() => setCreando(false)}>
          <MarcaForm
            onGuardar={guardar}
            onCancelar={() => setCreando(false)}
          />
        </Modal>
      )}
    </>
  )
}
