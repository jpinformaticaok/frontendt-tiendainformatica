import { useState } from 'react'

export default function ProductoForm({ producto, categorias, marcas, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState({
    nombre: producto?.nombre ?? '',
    marcaId: producto?.marcaId ?? (marcas[0]?.id ?? ''),
    precio: producto?.precio ?? '',
    stock: producto?.stock ?? 0,
    categoriaId: producto?.categoriaId ?? (categorias[0]?.id ?? ''),
  })
  const [error, setError] = useState('')

  function cambiar(e) {
    const { name, value } = e.target
    setDatos((previos) => ({ ...previos, [name]: value }))
  }

  function enviar(e) {
    e.preventDefault()

    if (!datos.nombre.trim()) {
      return setError('El nombre es obligatorio.')
    }
    if (!datos.marcaId) {
      return setError('Tenés que elegir una marca.')
    }
    if (datos.precio === '' || Number(datos.precio) < 0) {
      return setError('El precio debe ser un número mayor o igual a 0.')
    }
    if (Number(datos.stock) < 0) {
      return setError('El stock no puede ser negativo.')
    }
    if (!datos.categoriaId) {
      return setError('Tenés que elegir una categoría.')
    }

    setError('')
    onGuardar({
      nombre: datos.nombre.trim(),
      marcaId: Number(datos.marcaId),
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      categoriaId: Number(datos.categoriaId),
    })
  }

  return (
    <form onSubmit={enviar} noValidate>
      <div className="mb-3">
        <label className="form-label" htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          className="form-control"
          value={datos.nombre}
          onChange={cambiar}
          maxLength={150}
          required
        />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-sm-6">
          <label className="form-label" htmlFor="marcaId">Marca</label>
          <select
            id="marcaId"
            name="marcaId"
            className="form-select"
            value={datos.marcaId}
            onChange={cambiar}
            required
          >
            <option value="">Elegí una marca</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label" htmlFor="categoriaId">Categoría</label>
          <select
            id="categoriaId"
            name="categoriaId"
            className="form-select"
            value={datos.categoriaId}
            onChange={cambiar}
            required
          >
            <option value="">Elegí una categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-sm-6">
          <label className="form-label" htmlFor="precio">Precio (ARS)</label>
          <input
            id="precio"
            name="precio"
            type="number"
            min="0"
            step="0.01"
            className="form-control"
            value={datos.precio}
            onChange={cambiar}
            required
          />
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label" htmlFor="stock">Stock</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            className="form-control"
            value={datos.stock}
            onChange={cambiar}
            required
          />
        </div>
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
