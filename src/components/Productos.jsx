import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import { api } from '../api.js'
import Modal from './Modal.jsx'
import ProductoForm from './ProductoForm.jsx'

const formatoMoneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 2,
})

function BadgeStock({ stock }) {
  const clase = stock === 0 ? 'bg-danger' : stock <= 5 ? 'bg-warning text-dark' : 'bg-success'
  return <span className={`badge ${clase}`}>{stock}</span>
}

export default function Productos({ categoriaInicial, onConsumirCategoriaInicial }) {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [marcas, setMarcas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [texto, setTexto] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [editando, setEditando] = useState(null) // null = cerrado | 'nuevo' | producto

  async function cargar() {
    try {
      setCargando(true)
      const [listaProductos, listaCategorias, listaMarcas] = await Promise.all([
        api.productos.listar(),
        api.categorias.listar(),
        api.marcas.listar(),
      ])
      setProductos(listaProductos)
      setCategorias(listaCategorias)
      setMarcas(listaMarcas)
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

  useEffect(() => {
    if (categoriaInicial != null) {
      setCategoriaFiltro(String(categoriaInicial))
      onConsumirCategoriaInicial?.()
    }
  }, [categoriaInicial])

  const filtrados = useMemo(() => {
    const busqueda = texto.trim().toLowerCase()
    return productos.filter((p) => {
      const coincideTexto =
        !busqueda ||
        p.nombre.toLowerCase().includes(busqueda) ||
        p.marca.toLowerCase().includes(busqueda)
      const coincideCategoria =
        !categoriaFiltro || p.categoriaId === Number(categoriaFiltro)
      return coincideTexto && coincideCategoria
    })
  }, [productos, texto, categoriaFiltro])

  const totalStock = filtrados.reduce((acc, p) => acc + p.stock, 0)

  async function guardar(datos) {
    try {
      if (editando && editando !== 'nuevo') {
        await api.productos.actualizar(editando.id, datos)
        Swal.fire({
          icon: 'success',
          title: 'Producto actualizado',
          timer: 1500,
          showConfirmButton: false,
        })
      } else {
        await api.productos.crear(datos)
        Swal.fire({
          icon: 'success',
          title: 'Producto creado',
          timer: 1500,
          showConfirmButton: false,
        })
      }
      setEditando(null)
      await cargar()
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'No se pudo guardar', text: e.message })
    }
  }

  async function eliminar(producto) {
    const respuesta = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar producto?',
      text: `${producto.nombre} (${producto.marca})`,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
    })

    if (!respuesta.isConfirmed) return

    try {
      await api.productos.eliminar(producto.id)
      Swal.fire({
        icon: 'success',
        title: 'Producto eliminado',
        timer: 1500,
        showConfirmButton: false,
      })
      await cargar()
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'No se pudo eliminar', text: e.message })
    }
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h1 className="h4 mb-0">Productos</h1>
          <small className="text-muted">
            {filtrados.length} productos · {totalStock} unidades en stock
          </small>
        </div>
        <button className="btn btn-primary" onClick={() => setEditando('nuevo')}>
          + Nuevo producto
        </button>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="buscar">
                Buscar
              </label>
              <input
                id="buscar"
                className="form-control"
                placeholder="Nombre o marca"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label" htmlFor="filtroCategoria">
                Categoría
              </label>
              <select
                id="filtroCategoria"
                className="form-select"
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
              >
                <option value="">Todas</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-2 d-flex align-items-end">
              <button className="btn btn-outline-secondary w-100" onClick={cargar}>
                Refrescar
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          No se pudieron cargar los productos: {error}
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
                  <th scope="col">Nombre</th>
                  <th scope="col">Marca</th>
                  <th scope="col">Categoría</th>
                  <th scope="col" className="text-end">Precio</th>
                  <th scope="col" className="text-center">Stock</th>
                  <th scope="col" className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      No hay productos para mostrar.
                    </td>
                  </tr>
                ) : (
                  filtrados.map((p) => (
                    <tr key={p.id} className={p.stock === 0 ? 'stock-vacio' : ''}>
                      <td className="text-muted">{p.id}</td>
                      <td className="fw-semibold">{p.nombre}</td>
                      <td>{p.marca}</td>
                      <td>
                        <span className="badge bg-secondary">{p.categoria ?? '—'}</span>
                      </td>
                      <td className="text-end precio">{formatoMoneda.format(p.precio)}</td>
                      <td className="text-center">
                        <BadgeStock stock={p.stock} />
                      </td>
                      <td className="text-end text-nowrap">
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => setEditando(p)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => eliminar(p)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editando && (
        <Modal
          titulo={editando === 'nuevo' ? 'Nuevo producto' : 'Editar producto'}
          onClose={() => setEditando(null)}
        >
          <ProductoForm
            producto={editando === 'nuevo' ? null : editando}
            categorias={categorias}
            marcas={marcas}
            onGuardar={guardar}
            onCancelar={() => setEditando(null)}
          />
        </Modal>
      )}
    </>
  )
}
