import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Productos from './components/Productos.jsx'
import Categorias from './components/Categorias.jsx'
import { api } from './api.js'

export default function App() {
  const [vista, setVista] = useState('productos')
  const [apiOnline, setApiOnline] = useState(null)
  const [categoriaFiltro, setCategoriaFiltro] = useState(null)

  // Chequeo simple del estado de la API cada 20 segundos.
  useEffect(() => {
    let activo = true

    async function chequear() {
      try {
        await api.health()
        if (activo) setApiOnline(true)
      } catch {
        if (activo) setApiOnline(false)
      }
    }

    chequear()
    const intervalo = setInterval(chequear, 20000)
    return () => {
      activo = false
      clearInterval(intervalo)
    }
  }, [])

  function verProductosDeCategoria(id) {
    setCategoriaFiltro(id)
    setVista('productos')
  }

  return (
    <>
      <Navbar vista={vista} setVista={setVista} apiOnline={apiOnline} />
      <main className="container py-4">
        {vista === 'productos' ? (
          <Productos
            categoriaInicial={categoriaFiltro}
            onConsumirCategoriaInicial={() => setCategoriaFiltro(null)}
          />
        ) : (
          <Categorias onVerProductos={verProductosDeCategoria} />
        )}
      </main>
      <footer className="text-center text-muted small py-4">
        Tienda Informática · API {apiOnline ? 'conectada' : 'sin conexión'}
      </footer>
    </>
  )
}
