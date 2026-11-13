import { useState } from 'react'

export default function MarcaForm({ onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')

  function enviar(e) {
    e.preventDefault()

    if (!nombre.trim()) {
      return setError('El nombre de la marca es obligatorio.')
    }

    setError('')
    onGuardar({ nombre: nombre.trim() })
  }

  return (
    <form onSubmit={enviar} noValidate>
      <div className="mb-3">
        <label className="form-label" htmlFor="nombreMarca">Nombre</label>
        <input
          id="nombreMarca"
          className="form-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={80}
          required
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
