export default function Navbar({ vista, setVista, apiOnline }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <span className="navbar-brand">Tienda Informática</span>

        <div className="d-flex align-items-center gap-3">
          <div className="btn-group" role="group" aria-label="Secciones">
            <button
              type="button"
              className={`btn btn-sm ${vista === 'productos' ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => setVista('productos')}
            >
              Productos
            </button>
            <button
              type="button"
              className={`btn btn-sm ${vista === 'categorias' ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => setVista('categorias')}
            >
              Categorías
            </button>
          </div>

          <span
            className={`badge ${apiOnline ? 'bg-success' : 'bg-danger'}`}
            title={apiOnline ? 'La API responde' : 'No se puede conectar con la API'}
          >
            {apiOnline ? 'API conectada' : 'API sin conexión'}
          </span>
        </div>
      </div>
    </nav>
  )
}
