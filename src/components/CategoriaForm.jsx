import { useState } from 'react'

export default function CategoriaForm({ onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')

  function enviar(e) {
    e.preventDefault()

    if (!nombre.trim()) {
      return setError('El nombre es obligatorio.')
    }

    setError('')
    onGuardar({
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || null,
    })
  }

  return (
    <form onSubmit={enviar} noValidate>
      <div className="mb-3">
        <label className="form-label" htmlFor="nombreCategoria">Nombre</label>
        <input
          id="nombreCategoria"
          className="form-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={100}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="descripcionCategoria">Descripción</label>
        <textarea
          id="descripcionCategoria"
          className="form-control"
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          maxLength={250}
        />
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </div>
    </form>
  )
}
